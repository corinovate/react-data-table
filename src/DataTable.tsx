import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { BulkBar } from './components/BulkBar';
import { CardView } from './components/CardView';
import { AlertIcon, InboxIcon } from './components/icons';
import { Pagination } from './components/Pagination';
import type { BodyState, ViewProps } from './components/shared';
import { StateMessage } from './components/StateMessage';
import { TableView } from './components/TableView';
import { Toolbar } from './components/Toolbar';
import { useColorScheme } from './hooks/useColorScheme';
import { useContainerWidth } from './hooks/useContainerWidth';
import { useDataTable } from './hooks/useDataTable';
import { defaultLabels } from './labels';
import { resolveTheme } from './themes/createTheme';
import type { DataTableClassNames, DataTableProps, PaginationRenderProps } from './types';
import { cx, toCssSize } from './utils';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const NO_CLASSNAMES: DataTableClassNames = {};

function errorMessage(error: unknown, fallback: string): ReactNode {
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === 'string') return error;
  if (error === true) return fallback;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}

/**
 * A complete data table: search, sorting, pagination, selection, expandable rows,
 * themes, dark mode and responsive layouts — all optional.
 *
 * ```tsx
 * <DataTable data={users} columns={columns} />
 * ```
 */
export function DataTable<T = any>(props: DataTableProps<T>) {
  const {
    theme = 'default',
    colorMode = 'light',
    className,
    classNames = NO_CLASSNAMES,
    style,
    title,
    description,
    searchable = true,
    searchPlaceholder,
    filters,
    toolbarActions,
    columnToggle = true,
    rowActions,
    renderExpanded,
    bulkActions,
    loading = false,
    error,
    onRetry,
    loadingState,
    emptyState,
    errorState,
    pagination = true,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    renderPagination,
    stickyHeader = false,
    maxHeight,
    responsive = 'scroll',
    breakpoint = 640,
    ariaLabel,
    caption,
  } = props;

  const table = useDataTable<T>({ ...props, expandable: Boolean(renderExpanded) });
  const labels = useMemo(() => ({ ...defaultLabels, ...props.labels }), [props.labels]);
  const idPrefix = useId().replace(/:/g, '');
  const titleId = `${idPrefix}-title`;

  /* Theme */
  const mode = useColorScheme(colorMode);
  const resolved = useMemo(() => resolveTheme(theme, mode), [theme, mode]);

  /* Responsive */
  const rootRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(rootRef);
  const isNarrow = width !== null && width < breakpoint;
  const view = isNarrow && responsive === 'cards' ? 'cards' : 'table';
  const displayColumns = isNarrow
    ? table.visibleColumns.filter((c) => !c.hideOnMobile)
    : table.visibleColumns;

  /* Screen-reader announcements for sort and search results */
  const [announcement, setAnnouncement] = useState('');
  const sortSignature = JSON.stringify(table.sort);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const first = table.sort[0];
    const column = first && table.columns.find((c) => c.key === first.key);
    setAnnouncement(
      column
        ? first.direction === 'asc'
          ? labels.sortedAscending(column.label)
          : labels.sortedDescending(column.label)
        : labels.sortCleared,
    );
  }, [sortSignature]);
  const lastSearch = useRef(table.appliedSearch);
  useEffect(() => {
    if (lastSearch.current === table.appliedSearch || loading) return;
    lastSearch.current = table.appliedSearch;
    setAnnouncement(labels.resultsCount(table.totalRows));
  }, [table.appliedSearch, table.totalRows, loading, labels]);

  /* What the body shows */
  const hasRows = table.rows.length > 0;
  let body: BodyState;
  if (loading && !hasRows) {
    body = loadingState
      ? { kind: 'message', content: loadingState }
      : { kind: 'skeleton' };
  } else if (error && !loading) {
    body = {
      kind: 'message',
      content:
        typeof errorState === 'function'
          ? errorState(error)
          : (errorState ?? (
              <StateMessage
                tone="danger"
                role="alert"
                icon={<AlertIcon />}
                title={errorMessage(error, labels.error)}
                action={
                  onRetry && (
                    <button type="button" className="cdt-btn" onClick={onRetry}>
                      {labels.retry}
                    </button>
                  )
                }
              />
            )),
    };
  } else if (!hasRows) {
    const searching = table.appliedSearch !== '';
    body = {
      kind: 'message',
      content:
        emptyState && !searching ? (
          emptyState
        ) : (
          <StateMessage
            role="status"
            icon={<InboxIcon />}
            title={searching ? labels.noResults(table.appliedSearch) : labels.empty}
            action={
              searching && (
                <button type="button" className="cdt-btn" onClick={() => table.setSearch('')}>
                  {labels.clearSearch}
                </button>
              )
            }
          />
        ),
    };
  } else {
    body = { kind: 'rows' };
  }

  const viewProps: ViewProps<T> = {
    table,
    columns: displayColumns,
    labels,
    classNames,
    body,
    loading,
    idPrefix,
    rowActions,
    renderExpanded,
    onRowClick: props.onRowClick,
    rowClassName: props.rowClassName,
    skeletonRows: Math.min(table.pageSize, 6),
  };

  const paginationProps: PaginationRenderProps = {
    page: table.page,
    pageSize: table.pageSize,
    pageCount: table.pageCount,
    totalRows: table.totalRows,
    from: table.from,
    to: table.to,
    pageSizeOptions,
    canPreviousPage: table.page > 1,
    canNextPage: table.page < table.pageCount,
    setPage: table.setPage,
    setPageSize: table.setPageSize,
  };

  const showToolbar =
    searchable ||
    Boolean(filters) ||
    Boolean(toolbarActions) ||
    (columnToggle && table.columns.filter((c) => c.canHide).length > 1);
  const showBulkBar = table.selectionMode !== null && table.selectedKeys.length > 0;
  const showPagination = pagination && (table.totalRows > 0 || renderPagination !== undefined);

  const rootStyle = {
    ...resolved.style,
    ...(stickyHeader && maxHeight !== undefined ? { '--cdt-max-height': toCssSize(maxHeight) } : null),
    ...style,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={cx('cdt', className, classNames.root)}
      style={rootStyle}
      data-cdt-theme={resolved.name}
      data-cdt-mode={resolved.mode}
      data-cdt-view={view}
      data-cdt-narrow={isNarrow || undefined}
      data-cdt-compact={(isNarrow && responsive === 'compact') || undefined}
      data-cdt-sticky={stickyHeader || undefined}
    >
      {(title || description) && (
        <div className={cx('cdt-header', classNames.header)}>
          {title && (
            <div className="cdt-title" id={titleId}>
              {title}
            </div>
          )}
          {description && <div className="cdt-description">{description}</div>}
        </div>
      )}

      {showToolbar && (
        <Toolbar
          table={table}
          labels={labels}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          toolbarActions={toolbarActions}
          columnToggle={columnToggle}
          showSortSelect={view === 'cards' && props.sortable !== false}
          className={classNames.toolbar}
          searchClassName={classNames.search}
        />
      )}

      {showBulkBar && (
        <BulkBar table={table} labels={labels} bulkActions={bulkActions} className={classNames.bulkBar} />
      )}

      <div className={cx('cdt-container', classNames.container)}>
        {loading && hasRows && <div className="cdt-progress" role="progressbar" aria-label={labels.loading} />}
        {view === 'cards' ? (
          <CardView {...viewProps} labelledBy={title ? titleId : undefined} ariaLabel={ariaLabel} />
        ) : (
          <TableView
            {...viewProps}
            labelledBy={title ? titleId : undefined}
            ariaLabel={ariaLabel}
            caption={caption}
          />
        )}
      </div>

      {showPagination && (
        <div className={cx('cdt-footer', classNames.footer)}>
          {renderPagination ? (
            renderPagination(paginationProps)
          ) : (
            <Pagination
              {...paginationProps}
              labels={labels}
              compact={isNarrow}
              className={classNames.pagination}
            />
          )}
        </div>
      )}

      <div className="cdt-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {loading ? labels.loading : announcement}
      </div>
    </div>
  );
}
