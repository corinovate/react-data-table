import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { ResolvedColumn } from '../core/columns';
import type { DataTableInstance, TableRow } from '../hooks/useDataTable';
import type { DataTableLabels } from '../labels';
import type { DataTableClassNames, DataTableProps, RowAction, RowKey } from '../types';
import { cx, isFromInteractive } from '../utils';
import { ChevronRightIcon } from './icons';

export type BodyState = { kind: 'rows' } | { kind: 'skeleton' } | { kind: 'message'; content: ReactNode };

export interface ViewProps<T> {
  table: DataTableInstance<T>;
  /** Columns to display (visible, minus `hideOnMobile` on narrow screens). */
  columns: ResolvedColumn<T>[];
  labels: DataTableLabels;
  classNames: DataTableClassNames;
  body: BodyState;
  loading: boolean;
  idPrefix: string;
  rowActions?: DataTableProps<T>['rowActions'];
  renderExpanded?: DataTableProps<T>['renderExpanded'];
  onRowClick?: DataTableProps<T>['onRowClick'];
  rowClassName?: DataTableProps<T>['rowClassName'];
  skeletonRows: number;
}

export function formatValue(value: unknown, labels: DataTableLabels): ReactNode {
  if (value === null || value === undefined || value === '') {
    return <span className="cdt-empty-value">—</span>;
  }
  if (typeof value === 'boolean') return value ? labels.yes : labels.no;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? '—' : value.toLocaleDateString();
  if (Array.isArray(value)) return value.map((v) => (typeof v === 'object' ? JSON.stringify(v) : String(v))).join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function renderCell<T>(
  column: ResolvedColumn<T>,
  entry: TableRow<T>,
  labels: DataTableLabels,
): ReactNode {
  const value = column.read(entry.row);
  if (column.render) {
    return column.render(value, entry.row, {
      row: entry.row,
      rowKey: entry.key,
      rowIndex: entry.index,
      column,
    });
  }
  return formatValue(value, labels);
}

export function cellClassName<T>(column: ResolvedColumn<T>, row: T): string | undefined {
  return typeof column.className === 'function' ? column.className(row) : column.className;
}

export function RowActionButtons<T>({ row, actions }: { row: T; actions: RowAction<T>[] }) {
  return (
    <div className="cdt-row-actions">
      {actions
        .filter((action) => !action.hidden?.(row))
        .map((action) => {
          const disabled =
            typeof action.disabled === 'function' ? action.disabled(row) : Boolean(action.disabled);
          return (
            <button
              key={action.label}
              type="button"
              className={cx(
                'cdt-btn cdt-btn--sm',
                action.variant && action.variant !== 'default' && `cdt-btn--${action.variant}`,
                action.iconOnly && 'cdt-btn--icon',
              )}
              disabled={disabled}
              aria-label={action.iconOnly ? action.label : undefined}
              title={action.iconOnly ? action.label : undefined}
              onClick={() => action.onClick(row)}
            >
              {action.icon}
              {!action.iconOnly && <span>{action.label}</span>}
            </button>
          );
        })}
    </div>
  );
}

export function renderRowActions<T>(row: T, rowActions: ViewProps<T>['rowActions']): ReactNode {
  if (!rowActions) return null;
  if (typeof rowActions === 'function') return <div className="cdt-row-actions">{rowActions(row)}</div>;
  return <RowActionButtons row={row} actions={rowActions} />;
}

export function SelectCheckbox({
  checked,
  indeterminate = false,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className="cdt-checkbox"
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onChange={onChange}
    />
  );
}

export function ExpandButton({
  expanded,
  controls,
  labels,
  onToggle,
}: {
  expanded: boolean;
  controls: string;
  labels: DataTableLabels;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="cdt-btn cdt-btn--ghost cdt-btn--icon cdt-btn--sm cdt-expand-btn"
      aria-expanded={expanded}
      aria-controls={expanded ? controls : undefined}
      aria-label={expanded ? labels.collapseRow : labels.expandRow}
      title={expanded ? labels.collapseRow : labels.expandRow}
      onClick={onToggle}
    >
      <ChevronRightIcon />
    </button>
  );
}

export function expandedId(prefix: string, key: RowKey): string {
  return `${prefix}-expanded-${String(key).replace(/[^\w-]/g, '_')}`;
}

/**
 * Keyboard & pointer behavior shared by table rows and cards.
 * Rows use a roving tabindex: Tab enters the list once, arrows move between rows.
 */
export function useRowInteraction<T>(view: ViewProps<T>) {
  const { table, onRowClick } = view;
  const [activeKey, setActiveKey] = useState<RowKey | null>(null);
  const navigable = Boolean(onRowClick || table.selectionMode || table.expandable);
  const rowKeys = table.rows.map((r) => r.key);
  const focusKey = activeKey !== null && rowKeys.includes(activeKey) ? activeKey : (rowKeys[0] ?? null);

  const moveFocus = (current: HTMLElement, direction: 'next' | 'prev' | 'first' | 'last') => {
    const container = current.closest('[data-cdt-rows]');
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-cdt-row]'));
    const index = items.indexOf(current);
    const target =
      direction === 'first'
        ? items[0]
        : direction === 'last'
          ? items[items.length - 1]
          : items[index + (direction === 'next' ? 1 : -1)];
    target?.focus();
  };

  const getRowProps = (entry: TableRow<T>) => {
    const { row, key } = entry;
    const clickable = Boolean(onRowClick);
    return {
      'data-cdt-row': '',
      'data-selected': table.isSelected(key) || undefined,
      'data-clickable': clickable || undefined,
      tabIndex: navigable ? (key === focusKey ? 0 : -1) : undefined,
      onFocus: navigable ? () => setActiveKey(key) : undefined,
      onClick: clickable
        ? (event: MouseEvent<HTMLElement>) => {
            if (isFromInteractive(event.target, event.currentTarget)) return;
            onRowClick!(row, event);
          }
        : undefined,
      onKeyDown: navigable
        ? (event: KeyboardEvent<HTMLElement>) => {
            if (event.target !== event.currentTarget) return;
            const el = event.currentTarget;
            switch (event.key) {
              case 'ArrowDown':
                event.preventDefault();
                return moveFocus(el, 'next');
              case 'ArrowUp':
                event.preventDefault();
                return moveFocus(el, 'prev');
              case 'Home':
                event.preventDefault();
                return moveFocus(el, 'first');
              case 'End':
                event.preventDefault();
                return moveFocus(el, 'last');
              case 'ArrowRight':
                if (table.canExpandRow(row) && !table.isExpanded(key)) table.toggleExpanded(key);
                return;
              case 'ArrowLeft':
                if (table.isExpanded(key)) table.toggleExpanded(key);
                return;
              case 'Enter':
                if (onRowClick) onRowClick(row, event);
                else if (table.canExpandRow(row)) table.toggleExpanded(key);
                return;
              case ' ':
                if (table.canSelectRow(row)) {
                  event.preventDefault();
                  table.toggleRowSelection(key);
                }
                return;
            }
          }
        : undefined,
    };
  };

  return { getRowProps };
}
