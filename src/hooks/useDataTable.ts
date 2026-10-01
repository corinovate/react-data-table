import { useCallback, useEffect, useMemo, useRef } from 'react';
import { resolveColumns } from '../core/columns';
import type { ResolvedColumn } from '../core/columns';
import { clamp, getPageCount } from '../core/paginate';
import { searchRows } from '../core/search';
import { nextSort, sortRows } from '../core/sort';
import { getValue } from '../core/value';
import type { RowKey, SortItem, TableQuery, UseDataTableOptions } from '../types';
import { useControllableState } from './useControllableState';
import { useDebouncedValue } from './useDebouncedValue';

export interface TableRow<T> {
  row: T;
  key: RowKey;
  /** Index within the current page. */
  index: number;
}

export type PageSelectionState = 'all' | 'some' | 'none';

export interface DataTableInstance<T> {
  /** All columns, including hidden ones. */
  columns: ResolvedColumn<T>[];
  visibleColumns: ResolvedColumn<T>[];
  /** Rows on the current page. */
  rows: TableRow<T>[];
  /** Rows after search and sort, before pagination (client-side only). */
  processedRows: T[];
  totalRows: number;
  serverSide: boolean;

  search: string;
  /** The (debounced) search actually applied to the data. */
  appliedSearch: string;
  setSearch: (search: string) => void;

  sort: SortItem[];
  setSort: (sort: SortItem[]) => void;
  toggleSort: (key: string, additive?: boolean) => void;
  getSortState: (key: string) => { direction: SortItem['direction']; index: number } | undefined;

  paginated: boolean;
  page: number;
  pageSize: number;
  pageCount: number;
  from: number;
  to: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  hiddenColumns: string[];
  setHiddenColumns: (keys: string[]) => void;
  toggleColumnVisibility: (key: string) => void;

  selectionMode: 'single' | 'multiple' | null;
  selectedKeys: RowKey[];
  selectedRows: T[];
  isSelected: (key: RowKey) => boolean;
  canSelectRow: (row: T) => boolean;
  toggleRowSelection: (key: RowKey) => void;
  togglePageSelection: () => void;
  pageSelectionState: PageSelectionState;
  /** Selectable rows matching the current search (client-side only). */
  matchingSelectableCount: number;
  selectAllMatching: () => void;
  clearSelection: () => void;

  expandable: boolean;
  isExpanded: (key: RowKey) => boolean;
  canExpandRow: (row: T) => boolean;
  toggleExpanded: (key: RowKey) => void;

  query: TableQuery;
}

function defaultRowKey(row: unknown, index: number): RowKey {
  const id = row != null && typeof row === 'object' ? (row as { id?: unknown }).id : undefined;
  return typeof id === 'string' || typeof id === 'number' ? id : index;
}

const EMPTY: never[] = [];

/**
 * Headless engine behind `<DataTable>`. Use it directly to build a completely custom table UI.
 */
export function useDataTable<T = any>(
  options: UseDataTableOptions<T> & { expandable?: boolean },
): DataTableInstance<T> {
  const {
    data = EMPTY as T[],
    serverSide = false,
    searchable = true,
    sortable = true,
    multiSort = true,
    pagination = true,
    selectable = false,
    expandable = false,
    isRowSelectable,
    isRowExpandable,
    rowKey,
  } = options;

  const columns = useMemo(
    () => resolveColumns(options.columns, data, sortable, searchable),
    [options.columns, data, sortable, searchable],
  );

  /* ---------- Row keys ---------- */
  const rowKeyRef = useRef(rowKey);
  rowKeyRef.current = rowKey;
  const rowKeyProp = typeof rowKey === 'string' ? rowKey : null;
  const keyByRow = useMemo(() => {
    const map = new Map<T, RowKey>();
    const rk = rowKeyRef.current;
    data.forEach((row, index) => {
      const key =
        typeof rk === 'function'
          ? rk(row, index)
          : typeof rk === 'string'
            ? (getValue(row, rk) as RowKey)
            : defaultRowKey(row, index);
      map.set(row, key);
    });
    return map;
  }, [data, rowKeyProp]);

  // Remembers rows by key so selections survive paging and server refetches.
  const rowCache = useRef(new Map<RowKey, T>());
  useMemo(() => {
    keyByRow.forEach((key, row) => rowCache.current.set(key, row));
  }, [keyByRow]);

  /* ---------- Search ---------- */
  const [search, setSearch] = useControllableState(
    options.search,
    options.defaultSearch ?? '',
    options.onSearchChange,
  );
  const debounced = useDebouncedValue(search, options.searchDebounce ?? (serverSide ? 300 : 0));
  const appliedSearch = search.trim() === '' ? '' : debounced;

  /* ---------- Sort ---------- */
  const [sort, setSortState] = useControllableState<SortItem[]>(
    options.sort,
    options.defaultSort ?? [],
    options.onSortChange,
  );

  /* ---------- Pagination ---------- */
  const [rawPage, setPageState] = useControllableState(
    options.page,
    options.defaultPage ?? 1,
    options.onPageChange,
  );
  const [pageSize, setPageSizeState] = useControllableState(
    options.pageSize,
    options.defaultPageSize ?? 10,
    options.onPageSizeChange,
  );

  const setSort = useCallback(
    (next: SortItem[]) => {
      setSortState(next);
      setPageState(1);
    },
    [setSortState, setPageState],
  );
  const toggleSort = useCallback(
    (key: string, additive = false) => setSort(nextSort(sort, key, additive && multiSort)),
    [setSort, sort, multiSort],
  );
  const setPageSize = useCallback(
    (size: number) => {
      setPageSizeState(size);
      setPageState(1);
    },
    [setPageSizeState, setPageState],
  );

  /* ---------- Derived rows ---------- */
  const filtered = useMemo(
    () => (serverSide ? data : searchRows(data, appliedSearch, columns, options.searchFn)),
    [serverSide, data, appliedSearch, columns, options.searchFn],
  );
  const processedRows = useMemo(
    () => (serverSide ? filtered : sortRows(filtered, sort, columns)),
    [serverSide, filtered, sort, columns],
  );

  const totalRows = serverSide ? (options.totalRows ?? data.length) : processedRows.length;
  const pageCount = pagination ? getPageCount(totalRows, pageSize) : 1;
  // Server-side: the server owns the total, so don't clamp before it is known.
  const page = serverSide ? Math.max(1, rawPage) : clamp(rawPage, 1, pageCount);

  const pageRows = useMemo(() => {
    if (serverSide || !pagination) return processedRows;
    const start = (page - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [serverSide, pagination, processedRows, page, pageSize]);

  const rows = useMemo<TableRow<T>[]>(
    () => pageRows.map((row, index) => ({ row, key: keyByRow.get(row) ?? index, index })),
    [pageRows, keyByRow],
  );

  const from = totalRows === 0 ? 0 : pagination ? (page - 1) * pageSize + 1 : 1;
  const to = pagination ? Math.min(from + rows.length - 1, totalRows) : totalRows;

  /* ---------- Query emission & page reset on new search ---------- */
  const query = useMemo<TableQuery>(
    () => ({ page, pageSize, search: appliedSearch, sort }),
    [page, pageSize, appliedSearch, sort],
  );
  const lastSearch = useRef(appliedSearch);
  const lastQueryKey = useRef<string | null>(null);
  const onQueryChangeRef = useRef(options.onQueryChange);
  onQueryChangeRef.current = options.onQueryChange;

  useEffect(() => {
    let effective = query;
    if (lastSearch.current !== appliedSearch) {
      lastSearch.current = appliedSearch;
      if (query.page !== 1) {
        setPageState(1);
        effective = { ...query, page: 1 };
      }
    }
    if (!onQueryChangeRef.current) return;
    const key = JSON.stringify(effective);
    if (key === lastQueryKey.current) return;
    lastQueryKey.current = key;
    onQueryChangeRef.current(effective);
  }, [query, appliedSearch, setPageState]);

  /* ---------- Column visibility ---------- */
  const [hiddenColumns, setHiddenColumns] = useControllableState<string[]>(
    options.hiddenColumns,
    () => options.defaultHiddenColumns ?? (options.columns ?? []).filter((c) => c.hidden).map((c) => c.key),
    options.onHiddenColumnsChange,
  );
  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenColumns.includes(c.key)),
    [columns, hiddenColumns],
  );
  const toggleColumnVisibility = useCallback(
    (key: string) =>
      setHiddenColumns((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])),
    [setHiddenColumns],
  );

  /* ---------- Selection ---------- */
  const selectionMode = selectable === 'single' ? 'single' : selectable ? 'multiple' : null;
  const onSelectionChange = options.onSelectionChange;
  const [selectedKeys, setSelectedKeys] = useControllableState<RowKey[]>(
    options.selectedKeys,
    options.defaultSelectedKeys ?? [],
    onSelectionChange
      ? (keys) =>
          onSelectionChange(
            keys,
            keys.map((k) => rowCache.current.get(k)).filter((r): r is T => r !== undefined),
          )
      : undefined,
  );
  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const isSelected = useCallback((key: RowKey) => selectedSet.has(key), [selectedSet]);
  const canSelectRow = useCallback(
    (row: T) => selectionMode !== null && (isRowSelectable ? isRowSelectable(row) : true),
    [selectionMode, isRowSelectable],
  );

  const toggleRowSelection = useCallback(
    (key: RowKey) =>
      setSelectedKeys((prev) => {
        if (selectionMode === 'single') return prev.includes(key) ? [] : [key];
        return prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      }),
    [setSelectedKeys, selectionMode],
  );

  const pageSelectableKeys = useMemo(
    () => rows.filter((r) => canSelectRow(r.row)).map((r) => r.key),
    [rows, canSelectRow],
  );
  const selectedOnPage = pageSelectableKeys.filter((k) => selectedSet.has(k)).length;
  const pageSelectionState: PageSelectionState =
    selectedOnPage === 0
      ? 'none'
      : selectedOnPage === pageSelectableKeys.length
        ? 'all'
        : 'some';

  const togglePageSelection = useCallback(() => {
    setSelectedKeys((prev) => {
      const pageKeys = new Set(pageSelectableKeys);
      const allSelected = pageSelectableKeys.every((k) => prev.includes(k));
      if (allSelected) return prev.filter((k) => !pageKeys.has(k));
      return [...prev, ...pageSelectableKeys.filter((k) => !prev.includes(k))];
    });
  }, [setSelectedKeys, pageSelectableKeys]);

  const matchingSelectableKeys = useMemo(
    () =>
      serverSide || selectionMode !== 'multiple'
        ? []
        : processedRows.filter((r) => canSelectRow(r)).map((r, i) => keyByRow.get(r) ?? i),
    [serverSide, selectionMode, processedRows, canSelectRow, keyByRow],
  );
  const selectAllMatching = useCallback(() => {
    setSelectedKeys((prev) => [...prev, ...matchingSelectableKeys.filter((k) => !prev.includes(k))]);
  }, [setSelectedKeys, matchingSelectableKeys]);
  const clearSelection = useCallback(() => setSelectedKeys([]), [setSelectedKeys]);

  const selectedRows = useMemo(
    () => selectedKeys.map((k) => rowCache.current.get(k)).filter((r): r is T => r !== undefined),
    // rowCache is refreshed whenever keyByRow changes.
    [selectedKeys, keyByRow],
  );

  /* ---------- Expansion ---------- */
  const [expandedKeys, setExpandedKeys] = useControllableState<RowKey[]>(
    options.expandedKeys,
    options.defaultExpandedKeys ?? [],
    options.onExpandedChange,
  );
  const expandedSet = useMemo(() => new Set(expandedKeys), [expandedKeys]);
  const isExpanded = useCallback((key: RowKey) => expandedSet.has(key), [expandedSet]);
  const canExpandRow = useCallback(
    (row: T) => expandable && (isRowExpandable ? isRowExpandable(row) : true),
    [expandable, isRowExpandable],
  );
  const toggleExpanded = useCallback(
    (key: RowKey) =>
      setExpandedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])),
    [setExpandedKeys],
  );

  const getSortState = useCallback(
    (key: string) => {
      const index = sort.findIndex((s) => s.key === key);
      return index === -1 ? undefined : { direction: sort[index].direction, index: index + 1 };
    },
    [sort],
  );

  return {
    columns,
    visibleColumns,
    rows,
    processedRows,
    totalRows,
    serverSide,
    search,
    appliedSearch,
    setSearch,
    sort,
    setSort,
    toggleSort,
    getSortState,
    paginated: pagination,
    page,
    pageSize,
    pageCount,
    from,
    to,
    setPage: setPageState,
    setPageSize,
    hiddenColumns,
    setHiddenColumns,
    toggleColumnVisibility,
    selectionMode,
    selectedKeys,
    selectedRows,
    isSelected,
    canSelectRow,
    toggleRowSelection,
    togglePageSelection,
    pageSelectionState,
    matchingSelectableCount: matchingSelectableKeys.length,
    selectAllMatching,
    clearSelection,
    expandable,
    isExpanded,
    canExpandRow,
    toggleExpanded,
    query,
  };
}
