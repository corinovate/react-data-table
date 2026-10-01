import { useId } from 'react';
import { getPageItems } from '../core/paginate';
import { defaultLabels } from '../labels';
import type { DataTableLabels } from '../labels';
import type { PaginationRenderProps } from '../types';
import { cx } from '../utils';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from './icons';

export interface PaginationProps extends PaginationRenderProps {
  labels?: Partial<DataTableLabels>;
  /** Show "Page X of Y" instead of page numbers (used automatically on narrow tables). */
  compact?: boolean;
  className?: string;
}

/** The built-in pagination bar. Exported so custom layouts can reuse it. */
export function Pagination({
  page,
  pageSize,
  pageCount,
  totalRows,
  from,
  to,
  pageSizeOptions,
  canPreviousPage,
  canNextPage,
  setPage,
  setPageSize,
  labels: labelOverrides,
  compact = false,
  className,
}: PaginationProps) {
  const labels = { ...defaultLabels, ...labelOverrides };
  const sizeId = useId();
  const sizes = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  return (
    <div className={cx('cdt-pagination', className)}>
      <div className="cdt-pagination-info">
        {pageSizeOptions.length > 0 && (
          <div className="cdt-page-size">
            <label htmlFor={sizeId}>{labels.rowsPerPage}</label>
            <select
              id={sizeId}
              className="cdt-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        <span className="cdt-range">{labels.rangeInfo(from, to, totalRows)}</span>
      </div>

      <nav className="cdt-pages" aria-label={labels.pagination}>
        <button
          type="button"
          className="cdt-page-btn"
          onClick={() => setPage(1)}
          disabled={!canPreviousPage}
          aria-label={labels.firstPage}
          title={labels.firstPage}
        >
          <ChevronsLeftIcon />
        </button>
        <button
          type="button"
          className="cdt-page-btn"
          onClick={() => setPage(page - 1)}
          disabled={!canPreviousPage}
          aria-label={labels.previousPage}
          title={labels.previousPage}
        >
          <ChevronLeftIcon />
        </button>

        {compact ? (
          <span className="cdt-page-status">{labels.pageInfo(page, pageCount)}</span>
        ) : (
          getPageItems(page, pageCount).map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                className="cdt-page-btn"
                data-active={item === page || undefined}
                aria-current={item === page ? 'page' : undefined}
                aria-label={labels.goToPage(item)}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ) : (
              <span key={item} className="cdt-page-ellipsis" aria-hidden="true">
                …
              </span>
            ),
          )
        )}

        <button
          type="button"
          className="cdt-page-btn"
          onClick={() => setPage(page + 1)}
          disabled={!canNextPage}
          aria-label={labels.nextPage}
          title={labels.nextPage}
        >
          <ChevronRightIcon />
        </button>
        <button
          type="button"
          className="cdt-page-btn"
          onClick={() => setPage(pageCount)}
          disabled={!canNextPage}
          aria-label={labels.lastPage}
          title={labels.lastPage}
        >
          <ChevronsRightIcon />
        </button>
      </nav>
    </div>
  );
}
