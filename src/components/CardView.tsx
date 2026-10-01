import { cx } from '../utils';
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

interface CardViewProps<T> extends ViewProps<T> {
  labelledBy?: string;
  ariaLabel?: string;
}

/** Each row as a card with label/value pairs. Used on narrow containers with `responsive="cards"`. */
export function CardView<T>(props: CardViewProps<T>) {
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
    labelledBy,
    ariaLabel,
  } = props;
  const { getRowProps } = useRowInteraction(props);
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary);
  const selectable = table.selectionMode !== null;

  if (body.kind === 'message') return <div className="cdt-cards-state">{body.content}</div>;

  return (
    <div className="cdt-cards-wrap" aria-busy={loading || undefined}>
      {selectable && table.selectionMode === 'multiple' && body.kind === 'rows' && (
        <label className="cdt-cards-select-all">
          <SelectCheckbox
            checked={table.pageSelectionState === 'all'}
            indeterminate={table.pageSelectionState === 'some'}
            label={labels.selectAllOnPage}
            onChange={table.togglePageSelection}
          />
          <span aria-hidden="true">{labels.selectAllOnPage}</span>
        </label>
      )}
      <ul
        className="cdt-cards"
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        data-cdt-rows=""
        data-loading={loading || undefined}
      >
        {body.kind === 'skeleton' &&
          Array.from({ length: skeletonRows }, (_, i) => (
            <li key={i} className="cdt-card" aria-hidden="true">
              <span className="cdt-skeleton" style={{ width: '55%', height: 14 }} />
              <span className="cdt-skeleton" style={{ width: '80%' }} />
              <span className="cdt-skeleton" style={{ width: '65%' }} />
            </li>
          ))}

        {body.kind === 'rows' &&
          table.rows.map((entry, i) => {
            const { row, key } = entry;
            const isExpanded = Boolean(renderExpanded) && table.isExpanded(key);
            const detailsId = expandedId(idPrefix, key);
            return (
              <li
                key={key}
                className={cx(
                  'cdt-card',
                  classNames.card,
                  typeof rowClassName === 'function' ? rowClassName(row, i) : rowClassName,
                )}
                {...getRowProps(entry)}
              >
                <div className="cdt-card-head">
                  {selectable && (
                    <SelectCheckbox
                      checked={table.isSelected(key)}
                      disabled={!table.canSelectRow(row)}
                      label={labels.selectRow}
                      onChange={() => table.toggleRowSelection(key)}
                    />
                  )}
                  {primary && (
                    <div className={cx('cdt-card-title', cellClassName(primary, row))}>
                      {renderCell(primary, entry, labels)}
                    </div>
                  )}
                  {renderExpanded && table.canExpandRow(row) && (
                    <ExpandButton
                      expanded={isExpanded}
                      controls={detailsId}
                      labels={labels}
                      onToggle={() => table.toggleExpanded(key)}
                    />
                  )}
                </div>
                {rest.length > 0 && (
                  <dl className="cdt-card-fields">
                    {rest.map((column) => (
                      <div key={column.key} className="cdt-card-field">
                        <dt>{column.label}</dt>
                        <dd className={cellClassName(column, row)}>{renderCell(column, entry, labels)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {rowActions && <div className="cdt-card-actions">{renderRowActions(row, rowActions)}</div>}
                {isExpanded && renderExpanded && (
                  <div className="cdt-card-expanded" id={detailsId}>
                    {renderExpanded(row)}
                  </div>
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
}
