import { Fragment } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import type { ResolvedColumn } from '../core/columns';
import { cx, toCssSize } from '../utils';
import { SortIcon } from './icons';
import {
  ExpandButton,
  SelectCheckbox,
  cellClassName,
  expandedId,
  renderCell,
  renderRowActions,
  useRowInteraction,
} from './shared';
import type { ViewProps } from './shared';

interface TableViewProps<T> extends ViewProps<T> {
  caption?: ReactNode;
  labelledBy?: string;
  ariaLabel?: string;
}

export function TableView<T>(props: TableViewProps<T>) {
  const {
    table,
    columns,
    labels,
    classNames,
    body,
    loading,
    idPrefix,
    rowActions,
    renderExpanded,
    rowClassName,
    skeletonRows,
    caption,
    labelledBy,
    ariaLabel,
  } = props;
  const { getRowProps } = useRowInteraction(props);
  const selectable = table.selectionMode !== null;
  const expandable = Boolean(renderExpanded);
  const hasActions = Boolean(rowActions);
  const colSpan = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (hasActions ? 1 : 0);
  // Lets screen readers say "row 12 of 58" on paginated tables. Skipped when expanded rows would break the count.
  const indexRows = table.paginated && !expandable && body.kind === 'rows';

  return (
    <table
      className={cx('cdt-table', classNames.table)}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      aria-busy={loading || undefined}
      aria-rowcount={indexRows ? table.totalRows + 1 : undefined}
    >
      {caption && <caption className="cdt-sr-only">{caption}</caption>}
      <thead className={classNames.thead}>
        <tr aria-rowindex={indexRows ? 1 : undefined}>
          {selectable && (
            <th scope="col" className={cx('cdt-th cdt-col-select', classNames.th)}>
              {table.selectionMode === 'multiple' ? (
                <SelectCheckbox
                  checked={table.pageSelectionState === 'all' && table.rows.length > 0}
                  indeterminate={table.pageSelectionState === 'some'}
                  disabled={table.rows.length === 0}
                  label={labels.selectAllOnPage}
                  onChange={table.togglePageSelection}
                />
              ) : (
                <span className="cdt-sr-only">{labels.selectRow}</span>
              )}
            </th>
          )}
          {expandable && (
            <th scope="col" className={cx('cdt-th cdt-col-expand', classNames.th)}>
              <span className="cdt-sr-only">{labels.expandRow}</span>
            </th>
          )}
          {columns.map((column) => (
            <HeaderCell key={column.key} column={column} {...props} />
          ))}
          {hasActions && (
            <th scope="col" className={cx('cdt-th cdt-col-actions', classNames.th)} data-align="right">
              {labels.actions}
            </th>
          )}
        </tr>
      </thead>
      <tbody className={classNames.tbody} data-cdt-rows="" data-loading={loading || undefined}>
        {body.kind === 'skeleton' &&
          Array.from({ length: skeletonRows }, (_, i) => (
            <tr key={`skeleton-${i}`} className="cdt-skeleton-row" aria-hidden="true">
              {Array.from({ length: colSpan }, (_, j) => (
                <td key={j} className="cdt-td">
                  <span className="cdt-skeleton" style={{ width: `${45 + ((i * 7 + j * 13) % 45)}%` }} />
                </td>
              ))}
            </tr>
          ))}

        {body.kind === 'message' && (
          <tr>
            <td colSpan={colSpan} className="cdt-td cdt-state-cell">
              {body.content}
            </td>
          </tr>
        )}

        {body.kind === 'rows' &&
          table.rows.map((entry, i) => {
            const { row, key } = entry;
            const isExpanded = expandable && table.isExpanded(key);
            const canExpand = expandable && table.canExpandRow(row);
            const detailsId = expandedId(idPrefix, key);
            return (
              <Fragment key={key}>
                <tr
                  className={cx(
                    'cdt-row',
                    classNames.tr,
                    typeof rowClassName === 'function' ? rowClassName(row, i) : rowClassName,
                  )}
                  data-stripe={i % 2 === 1 || undefined}
                  data-expanded={isExpanded || undefined}
                  aria-rowindex={indexRows ? table.from + i + 1 : undefined}
                  {...getRowProps(entry)}
                >
                  {selectable && (
                    <td className={cx('cdt-td cdt-col-select', classNames.td)}>
                      <SelectCheckbox
                        checked={table.isSelected(key)}
                        disabled={!table.canSelectRow(row)}
                        label={labels.selectRow}
                        onChange={() => table.toggleRowSelection(key)}
                      />
                    </td>
                  )}
                  {expandable && (
                    <td className={cx('cdt-td cdt-col-expand', classNames.td)}>
                      {canExpand && (
                        <ExpandButton
                          expanded={isExpanded}
                          controls={detailsId}
                          labels={labels}
                          onToggle={() => table.toggleExpanded(key)}
                        />
                      )}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cx('cdt-td', classNames.td, cellClassName(column, row))}
                      data-align={column.align}
                    >
                      {renderCell(column, entry, labels)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className={cx('cdt-td cdt-col-actions', classNames.td)} data-align="right">
                      {renderRowActions(row, rowActions)}
                    </td>
                  )}
                </tr>
                {isExpanded && renderExpanded && (
                  <tr className="cdt-expanded-row" id={detailsId}>
                    <td colSpan={colSpan} className="cdt-td cdt-expanded-cell">
                      {renderExpanded(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
      </tbody>
    </table>
  );
}

function HeaderCell<T>({ column, table, labels, classNames }: TableViewProps<T> & { column: ResolvedColumn<T> }) {
  const sortState = table.getSortState(column.key);
  const direction = sortState?.direction;
  const showIndex = sortState && table.sort.length > 1;
  const content =
    typeof column.header === 'function'
      ? column.header({ column, sortDirection: direction, sortIndex: sortState?.index })
      : (column.header ?? column.label);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.shiftKey && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      table.toggleSort(column.key, true);
    }
  };

  return (
    <th
      scope="col"
      className={cx('cdt-th', classNames.th, column.headerClassName)}
      data-align={column.align}
      data-sorted={direction}
      aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined}
      style={{ width: toCssSize(column.width), minWidth: toCssSize(column.minWidth) }}
    >
      {column.canSort ? (
        <button
          type="button"
          className="cdt-sort-btn"
          onClick={(event) => table.toggleSort(column.key, event.shiftKey || event.metaKey || event.ctrlKey)}
          onKeyDown={onKeyDown}
        >
          <span>{content}</span>
          <SortIcon direction={direction} />
          {showIndex && (
            <span className="cdt-sort-index">
              <span aria-hidden="true">{sortState.index}</span>
              <span className="cdt-sr-only">, {labels.sortPriority(sortState.index)}</span>
            </span>
          )}
        </button>
      ) : (
        content
      )}
    </th>
  );
}
