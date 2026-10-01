export interface DataTableLabels {
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

export const defaultLabels: DataTableLabels = {
  searchPlaceholder: 'Search…',
  searchLabel: 'Search table',
  clearSearch: 'Clear search',
  columns: 'Columns',
  toggleColumns: 'Show or hide columns',
  loading: 'Loading…',
  empty: 'No data to display',
  noResults: (search) => `No results for “${search}”`,
  error: 'Something went wrong while loading data.',
  retry: 'Try again',
  rowsPerPage: 'Rows per page',
  rangeInfo: (from, to, total) => `${from}–${to} of ${total}`,
  pageInfo: (page, pageCount) => `Page ${page} of ${pageCount}`,
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  goToPage: (page) => `Go to page ${page}`,
  pagination: 'Pagination',
  selectAllOnPage: 'Select all rows on this page',
  selectRow: 'Select row',
  selectedCount: (count) => `${count} selected`,
  selectAllMatching: (count) => `Select all ${count}`,
  clearSelection: 'Clear selection',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  actions: 'Actions',
  sortBy: 'Sort by',
  sortPriority: (index) => `sort priority ${index}`,
  sortedAscending: (column) => `Sorted by ${column}, ascending`,
  sortedDescending: (column) => `Sorted by ${column}, descending`,
  sortCleared: 'Sorting removed',
  resultsCount: (count) => (count === 1 ? '1 result' : `${count} results`),
  yes: 'Yes',
  no: 'No',
};
