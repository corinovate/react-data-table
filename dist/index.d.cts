import * as react from 'react';
import { ReactNode, CSSProperties, MouseEvent, KeyboardEvent, HTMLAttributes } from 'react';

interface DataTableLabels {
    searchPlaceholder: string;
    searchLabel: string;
    clearSearch: string;
    columns: string;
    toggleColumns: string;
    loading: string;
    empty: string;
    noResults: (search: string) => string;
    error: string;
    retry: string;
    rowsPerPage: string;
    rangeInfo: (from: number, to: number, total: number) => string;
    pageInfo: (page: number, pageCount: number) => string;
    firstPage: string;
    previousPage: string;
    nextPage: string;
    lastPage: string;
    goToPage: (page: number) => string;
    pagination: string;
    selectAllOnPage: string;
    selectRow: string;
    selectedCount: (count: number) => string;
    selectAllMatching: (count: number) => string;
    clearSelection: string;
    expandRow: string;
    collapseRow: string;
    actions: string;
    sortBy: string;
    sortPriority: (index: number) => string;
    sortedAscending: (column: string) => string;
    sortedDescending: (column: string) => string;
    sortCleared: string;
    resultsCount: (count: number) => string;
    yes: string;
    no: string;
}
declare const defaultLabels: DataTableLabels;

/**
 * Design tokens. Each one becomes a CSS variable on the table root:
 * `rowHoverBackground` → `--cdt-row-hover-background`.
 */
interface ThemeTokens {
    background: string;
    headerBackground: string;
    rowHoverBackground: string;
    rowStripeBackground: string;
    rowSelectedBackground: string;
    expandedBackground: string;
    controlBackground: string;
    popoverBackground: string;
    border: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    headerText: string;
    accent: string;
    accentText: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    focusRing: string;
    skeleton: string;
    radius: string;
    controlRadius: string;
    badgeRadius: string;
    borderWidth: string;
    rowBorderWidth: string;
    columnBorderWidth: string;
    shadow: string;
    popoverShadow: string;
    backdropFilter: string;
    cellPaddingX: string;
    cellPaddingY: string;
    headerPaddingY: string;
    rowHeight: string;
    controlHeight: string;
    gap: string;
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    headerFontSize: string;
    headerFontWeight: string;
    headerTextTransform: string;
    headerLetterSpacing: string;
    titleFontSize: string;
    transition: string;
}
type ThemeName = 'default' | 'minimal' | 'modern' | 'compact' | 'dark' | 'glass';
type ColorMode = 'light' | 'dark' | 'system';
interface Theme {
    name?: string;
    /** Overrides on top of the base light tokens. */
    tokens?: Partial<ThemeTokens>;
    /** Overrides applied in dark mode (on top of the base dark tokens). */
    darkTokens?: Partial<ThemeTokens>;
    /** Ignore `colorMode` and always render in this mode. */
    forcedMode?: 'light' | 'dark';
}
type ThemeInput = ThemeName | Theme;
declare const baseTokens: ThemeTokens;
declare const baseDarkTokens: Partial<ThemeTokens>;

type RowKey = string | number;
type SortDirection = 'asc' | 'desc';
type Align = 'left' | 'center' | 'right';
interface SortItem {
    key: string;
    direction: SortDirection;
}
interface CellContext<T> {
    row: T;
    rowKey: RowKey;
    /** Index of the row within the current page. */
    rowIndex: number;
    column: Column<T>;
}
interface HeaderContext<T> {
    column: Column<T>;
    /** Current sort direction of this column, if sorted. */
    sortDirection: SortDirection | undefined;
    /** 1-based position in a multi-column sort, if sorted. */
    sortIndex: number | undefined;
}
interface Column<T = any> {
    /** Property name or dot path (`"address.city"`). Also used as the column id. */
    key: string;
    /** Header content. Defaults to a humanized `key` ("firstName" → "First name"). */
    header?: ReactNode | ((ctx: HeaderContext<T>) => ReactNode);
    /** Plain-text name used in the column menu, card view and screen-reader text. */
    label?: string;
    /** Compute the value instead of reading `row[key]`. */
    accessor?: (row: T) => unknown;
    /** Custom cell content. */
    render?: (value: any, row: T, ctx: CellContext<T>) => ReactNode;
    /** Defaults to `true` for columns that map to data. */
    sortable?: boolean;
    /** Custom comparator for sorting (ascending order). */
    compare?: (a: T, b: T) => number;
    /** Defaults to `true` for columns that map to data. */
    searchable?: boolean;
    /** Custom text used when searching. */
    searchValue?: (row: T) => string;
    /** Hide the column initially (users can show it from the column menu). */
    hidden?: boolean;
    /** Allow toggling this column in the column menu. Default `true`. */
    hideable?: boolean;
    /** Hide this column when the table is narrower than `breakpoint`. */
    hideOnMobile?: boolean;
    /** Use this column as the card title in card view. Defaults to the first column. */
    primary?: boolean;
    align?: Align;
    width?: number | string;
    minWidth?: number | string;
    /** Class for body cells. A function receives the row. */
    className?: string | ((row: T) => string | undefined);
    headerClassName?: string;
}
type ActionVariant = 'default' | 'primary' | 'danger' | 'ghost';
interface RowAction<T = any> {
    label: string;
    onClick: (row: T) => void;
    icon?: ReactNode;
    variant?: ActionVariant;
    /** Show only the icon; `label` becomes the accessible name. */
    iconOnly?: boolean;
    hidden?: (row: T) => boolean;
    disabled?: boolean | ((row: T) => boolean);
}
/** Everything a server needs to fetch one page. Emitted by `onQueryChange`. */
interface TableQuery {
    /** 1-based page number. */
    page: number;
    pageSize: number;
    search: string;
    sort: SortItem[];
}
interface PaginationRenderProps {
    page: number;
    pageSize: number;
    pageCount: number;
    totalRows: number;
    /** 1-based index of the first row on this page (0 when empty). */
    from: number;
    /** 1-based index of the last row on this page. */
    to: number;
    pageSizeOptions: number[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
}
interface BulkActionHelpers {
    selectedKeys: RowKey[];
    clearSelection: () => void;
}
type ResponsiveMode = 'scroll' | 'cards' | 'compact';
type SelectionMode = boolean | 'single' | 'multiple';
type DataTableSlot = 'root' | 'header' | 'toolbar' | 'search' | 'bulkBar' | 'container' | 'table' | 'thead' | 'th' | 'tbody' | 'tr' | 'td' | 'card' | 'footer' | 'pagination';
type DataTableClassNames = Partial<Record<DataTableSlot, string>>;
/** Options understood by the headless `useDataTable` hook. */
interface UseDataTableOptions<T = any> {
    data?: T[];
    columns?: Column<T>[];
    /** Property name or function giving each row a stable id. Defaults to `row.id`, then the index. */
    rowKey?: string | ((row: T, index: number) => RowKey);
    /** Data is already searched, sorted and paginated by your server. */
    serverSide?: boolean;
    /** Total number of rows on the server (server-side pagination). */
    totalRows?: number;
    /** Fires on mount and whenever page, page size, search or sort changes. */
    onQueryChange?: (query: TableQuery) => void;
    searchable?: boolean;
    search?: string;
    defaultSearch?: string;
    onSearchChange?: (search: string) => void;
    /** Milliseconds. Defaults to 300 with `serverSide`, otherwise 0. */
    searchDebounce?: number;
    /** Replace the built-in search. */
    searchFn?: (row: T, query: string) => boolean;
    sortable?: boolean;
    /** Shift-click headers to sort by several columns. Default `true`. */
    multiSort?: boolean;
    sort?: SortItem[];
    defaultSort?: SortItem[];
    onSortChange?: (sort: SortItem[]) => void;
    /** `false` disables pagination and shows every row. Default `true`. */
    pagination?: boolean;
    /** 1-based. */
    page?: number;
    defaultPage?: number;
    onPageChange?: (page: number) => void;
    pageSize?: number;
    /** Default `10`. */
    defaultPageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    selectable?: SelectionMode;
    selectedKeys?: RowKey[];
    defaultSelectedKeys?: RowKey[];
    onSelectionChange?: (keys: RowKey[], rows: T[]) => void;
    isRowSelectable?: (row: T) => boolean;
    expandedKeys?: RowKey[];
    defaultExpandedKeys?: RowKey[];
    onExpandedChange?: (keys: RowKey[]) => void;
    isRowExpandable?: (row: T) => boolean;
    hiddenColumns?: string[];
    defaultHiddenColumns?: string[];
    onHiddenColumnsChange?: (keys: string[]) => void;
}
interface DataTableProps<T = any> extends UseDataTableOptions<T> {
    theme?: ThemeInput;
    colorMode?: ColorMode;
    className?: string;
    classNames?: DataTableClassNames;
    style?: CSSProperties;
    rowClassName?: string | ((row: T, index: number) => string | undefined);
    title?: ReactNode;
    description?: ReactNode;
    searchPlaceholder?: string;
    /** Your own filter controls, rendered next to the search box. */
    filters?: ReactNode;
    /** Buttons rendered at the right of the toolbar (e.g. "Add user"). */
    toolbarActions?: ReactNode;
    /** Show the "Columns" visibility menu. Default `true`. */
    columnToggle?: boolean;
    onRowClick?: (row: T, event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
    rowActions?: RowAction<T>[] | ((row: T) => ReactNode);
    /** Content shown when a row is expanded. Enables the expand column. */
    renderExpanded?: (row: T) => ReactNode;
    bulkActions?: (selectedRows: T[], helpers: BulkActionHelpers) => ReactNode;
    loading?: boolean;
    error?: unknown;
    onRetry?: () => void;
    loadingState?: ReactNode;
    emptyState?: ReactNode;
    errorState?: ReactNode | ((error: unknown) => ReactNode);
    pageSizeOptions?: number[];
    renderPagination?: (props: PaginationRenderProps) => ReactNode;
    /** Keep the header visible while the body scrolls inside `maxHeight`. */
    stickyHeader?: boolean;
    /** Height of the scroll area when `stickyHeader` is on. Default `"70vh"`. */
    maxHeight?: number | string;
    /** What happens below `breakpoint`. Default `"scroll"`. */
    responsive?: ResponsiveMode;
    /** Container width (px) under which the responsive mode applies. Default `640`. */
    breakpoint?: number;
    /** Accessible name for the table when there is no `title`. */
    ariaLabel?: string;
    caption?: ReactNode;
    labels?: Partial<DataTableLabels>;
}

/**
 * A complete data table: search, sorting, pagination, selection, expandable rows,
 * themes, dark mode and responsive layouts — all optional.
 *
 * ```tsx
 * <DataTable data={users} columns={columns} />
 * ```
 */
declare function DataTable<T = any>(props: DataTableProps<T>): react.JSX.Element;

interface ResolvedColumn<T = any> extends Column<T> {
    label: string;
    canSort: boolean;
    canSearch: boolean;
    canHide: boolean;
    read: (row: T) => unknown;
}

interface TableRow<T> {
    row: T;
    key: RowKey;
    /** Index within the current page. */
    index: number;
}
type PageSelectionState = 'all' | 'some' | 'none';
interface DataTableInstance<T> {
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
    getSortState: (key: string) => {
        direction: SortItem['direction'];
        index: number;
    } | undefined;
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
/**
 * Headless engine behind `<DataTable>`. Use it directly to build a completely custom table UI.
 */
declare function useDataTable<T = any>(options: UseDataTableOptions<T> & {
    expandable?: boolean;
}): DataTableInstance<T>;

interface PaginationProps extends PaginationRenderProps {
    labels?: Partial<DataTableLabels>;
    /** Show "Page X of Y" instead of page numbers (used automatically on narrow tables). */
    compact?: boolean;
    className?: string;
}
/** The built-in pagination bar. Exported so custom layouts can reuse it. */
declare function Pagination({ page, pageSize, pageCount, totalRows, from, to, pageSizeOptions, canPreviousPage, canNextPage, setPage, setPageSize, labels: labelOverrides, compact, className, }: PaginationProps): react.JSX.Element;

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: BadgeTone;
    /** Show a small colored dot before the text. */
    dot?: boolean;
}
/** Theme-aware status badge. Use inside table cells. */
declare function Badge({ tone, dot, className, children, ...rest }: BadgeProps): react.JSX.Element;
/**
 * Column `render` helper that maps values to badge tones.
 *
 * ```ts
 * { key: 'status', render: renderBadge({ active: 'success', pending: 'warning', banned: 'danger' }) }
 * ```
 */
declare function renderBadge(tones: Record<string, BadgeTone>, options?: {
    dot?: boolean;
    fallback?: BadgeTone;
    format?: (value: unknown) => ReactNode;
}): (value: unknown) => ReactNode;

interface CreateThemeOptions extends Theme {
    /** Preset (or theme) to start from. Default `"default"`. */
    extends?: ThemeInput;
}
/**
 * Build a custom theme on top of a preset.
 *
 * ```ts
 * const brand = createTheme({ extends: 'modern', tokens: { accent: '#e11d48' } });
 * ```
 */
declare function createTheme(options?: CreateThemeOptions): Theme;
interface ResolvedTheme {
    name: string;
    mode: 'light' | 'dark';
    tokens: ThemeTokens;
    /** CSS custom properties to put on the root element. */
    style: Record<string, string>;
}
/** Merge a theme into a complete token set for one color mode. */
declare function resolveTheme(input: ThemeInput | undefined, mode: 'light' | 'dark'): ResolvedTheme;

declare const themes: Record<ThemeName, Theme>;

/** Read `row[key]`, supporting dot paths such as `"address.city"`. */
declare function getValue(row: unknown, key: string): unknown;
/** "firstName" → "First name", "created_at" → "Created at", "address.city" → "City". */
declare function humanize(key: string): string;

/** Compare two non-empty values in ascending order. */
declare function compareValues(a: unknown, b: unknown): number;
/**
 * Stable multi-column sort. Empty values (null, undefined, '') always go last.
 * Returns the original array when there is nothing to sort.
 */
declare function sortRows<T>(rows: T[], sort: SortItem[], columns: ResolvedColumn<T>[]): T[];

/**
 * Case-insensitive search across searchable columns.
 * Every whitespace-separated term must match somewhere in the row ("jane admin").
 */
declare function searchRows<T>(rows: T[], query: string, columns: ResolvedColumn<T>[], searchFn?: (row: T, query: string) => boolean): T[];

export { type ActionVariant, type Align, Badge, type BadgeProps, type BadgeTone, type BulkActionHelpers, type CellContext, type ColorMode, type Column, type CreateThemeOptions, DataTable, type DataTableClassNames, type DataTableInstance, type DataTableLabels, type DataTableProps, type DataTableSlot, type HeaderContext, type PageSelectionState, Pagination, type PaginationProps, type PaginationRenderProps, type ResolvedColumn, type ResolvedTheme, type ResponsiveMode, type RowAction, type RowKey, type SelectionMode, type SortDirection, type SortItem, type TableQuery, type TableRow, type Theme, type ThemeInput, type ThemeName, type ThemeTokens, type UseDataTableOptions, baseDarkTokens, baseTokens, compareValues, createTheme, defaultLabels, getValue, humanize, renderBadge, resolveTheme, searchRows, sortRows, themes, useDataTable };
