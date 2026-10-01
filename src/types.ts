import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { DataTableLabels } from './labels';
import type { ColorMode, ThemeInput } from './themes/tokens';

export type RowKey = string | number;
export type SortDirection = 'asc' | 'desc';
export type Align = 'left' | 'center' | 'right';

export interface SortItem {
  key: string;
  direction: SortDirection;
}

export interface CellContext<T> {
  row: T;
  rowKey: RowKey;
  /** Index of the row within the current page. */
  rowIndex: number;
  column: Column<T>;
}

export interface HeaderContext<T> {
  column: Column<T>;
  /** Current sort direction of this column, if sorted. */
  sortDirection: SortDirection | undefined;
  /** 1-based position in a multi-column sort, if sorted. */
  sortIndex: number | undefined;
}

export interface Column<T = any> {
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

export type ActionVariant = 'default' | 'primary' | 'danger' | 'ghost';

export interface RowAction<T = any> {
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
export interface TableQuery {
  /** 1-based page number. */
  page: number;
  pageSize: number;
  search: string;
  sort: SortItem[];
}

export interface PaginationRenderProps {
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

export interface BulkActionHelpers {
  selectedKeys: RowKey[];
  clearSelection: () => void;
}

export type ResponsiveMode = 'scroll' | 'cards' | 'compact';
export type SelectionMode = boolean | 'single' | 'multiple';

export type DataTableSlot =
  | 'root'
  | 'header'
  | 'toolbar'
  | 'search'
  | 'bulkBar'
  | 'container'
  | 'table'
  | 'thead'
  | 'th'
  | 'tbody'
  | 'tr'
  | 'td'
  | 'card'
  | 'footer'
  | 'pagination';

export type DataTableClassNames = Partial<Record<DataTableSlot, string>>;

/** Options understood by the headless `useDataTable` hook. */
export interface UseDataTableOptions<T = any> {
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

export interface DataTableProps<T = any> extends UseDataTableOptions<T> {
  /* Appearance */
  theme?: ThemeInput;
  colorMode?: ColorMode;
  className?: string;
  classNames?: DataTableClassNames;
  style?: CSSProperties;
  rowClassName?: string | ((row: T, index: number) => string | undefined);

  /* Header & toolbar */
  title?: ReactNode;
  description?: ReactNode;
  searchPlaceholder?: string;
  /** Your own filter controls, rendered next to the search box. */
  filters?: ReactNode;
  /** Buttons rendered at the right of the toolbar (e.g. "Add user"). */
  toolbarActions?: ReactNode;
  /** Show the "Columns" visibility menu. Default `true`. */
  columnToggle?: boolean;

  /* Rows */
  onRowClick?: (row: T, event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void;
  rowActions?: RowAction<T>[] | ((row: T) => ReactNode);
  /** Content shown when a row is expanded. Enables the expand column. */
  renderExpanded?: (row: T) => ReactNode;
  bulkActions?: (selectedRows: T[], helpers: BulkActionHelpers) => ReactNode;

  /* States */
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  loadingState?: ReactNode;
  emptyState?: ReactNode;
  errorState?: ReactNode | ((error: unknown) => ReactNode);

  /* Pagination */
  pageSizeOptions?: number[];
  renderPagination?: (props: PaginationRenderProps) => ReactNode;

  /* Layout */
  /** Keep the header visible while the body scrolls inside `maxHeight`. */
  stickyHeader?: boolean;
  /** Height of the scroll area when `stickyHeader` is on. Default `"70vh"`. */
  maxHeight?: number | string;
  /** What happens below `breakpoint`. Default `"scroll"`. */
  responsive?: ResponsiveMode;
  /** Container width (px) under which the responsive mode applies. Default `640`. */
  breakpoint?: number;

  /* Accessibility & i18n */
  /** Accessible name for the table when there is no `title`. */
  ariaLabel?: string;
  caption?: ReactNode;
  labels?: Partial<DataTableLabels>;
}
