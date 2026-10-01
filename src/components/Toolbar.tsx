import { useId } from 'react';
import type { ReactNode } from 'react';
import type { ResolvedColumn } from '../core/columns';
import type { DataTableInstance } from '../hooks/useDataTable';
import type { DataTableLabels } from '../labels';
import { cx } from '../utils';
import { ColumnMenu } from './ColumnMenu';
import { CloseIcon, SearchIcon } from './icons';

interface ToolbarProps {
  table: DataTableInstance<any>;
  labels: DataTableLabels;
  searchable: boolean;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbarActions?: ReactNode;
  columnToggle: boolean;
  /** Card view has no headers, so it gets a sort dropdown. */
  showSortSelect: boolean;
  className?: string;
  searchClassName?: string;
}

export function Toolbar({
  table,
  labels,
  searchable,
  searchPlaceholder,
  filters,
  toolbarActions,
  columnToggle,
  showSortSelect,
  className,
  searchClassName,
}: ToolbarProps) {
  const searchId = useId();
  const sortableColumns = table.visibleColumns.filter((c) => c.canSort);
  const hideableColumns = table.columns.filter((c) => c.canHide);

  return (
    <div className={cx('cdt-toolbar', className)}>
      <div className="cdt-toolbar-start">
        {searchable && (
          <div className={cx('cdt-search', searchClassName)} role="search">
            <label htmlFor={searchId} className="cdt-sr-only">
              {labels.searchLabel}
            </label>
            <SearchIcon />
            <input
              id={searchId}
              type="search"
              className="cdt-input"
              placeholder={searchPlaceholder ?? labels.searchPlaceholder}
              value={table.search}
              onChange={(e) => table.setSearch(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {table.search && (
              <button
                type="button"
                className="cdt-search-clear"
                onClick={() => table.setSearch('')}
                aria-label={labels.clearSearch}
                title={labels.clearSearch}
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        {filters && <div className="cdt-filters">{filters}</div>}
      </div>
      <div className="cdt-toolbar-end">
        {showSortSelect && sortableColumns.length > 0 && (
          <SortSelect columns={sortableColumns} table={table} labels={labels} />
        )}
        {toolbarActions}
        {columnToggle && hideableColumns.length > 1 && (
          <ColumnMenu
            columns={table.columns}
            hiddenColumns={table.hiddenColumns}
            onToggle={table.toggleColumnVisibility}
            label={labels.columns}
            title={labels.toggleColumns}
          />
        )}
      </div>
    </div>
  );
}

function SortSelect({
  columns,
  table,
  labels,
}: {
  columns: ResolvedColumn[];
  table: DataTableInstance<any>;
  labels: DataTableLabels;
}) {
  const id = useId();
  const current = table.sort[0];
  const value = current ? `${current.direction}:${current.key}` : '';

  return (
    <>
      <label htmlFor={id} className="cdt-sr-only">
        {labels.sortBy}
      </label>
      <select
        id={id}
        className="cdt-select cdt-sort-select"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          if (!next) return table.setSort([]);
          const separator = next.indexOf(':');
          table.setSort([
            { direction: next.slice(0, separator) as 'asc' | 'desc', key: next.slice(separator + 1) },
          ]);
        }}
      >
        <option value="">{labels.sortBy}…</option>
        {columns.map((column) => [
          <option key={`asc:${column.key}`} value={`asc:${column.key}`}>
            {column.label} ↑
          </option>,
          <option key={`desc:${column.key}`} value={`desc:${column.key}`}>
            {column.label} ↓
          </option>,
        ])}
      </select>
    </>
  );
}
