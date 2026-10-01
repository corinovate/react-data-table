import type { ReactNode } from 'react';
import type { DataTableInstance } from '../hooks/useDataTable';
import type { DataTableLabels } from '../labels';
import type { BulkActionHelpers } from '../types';
import { cx } from '../utils';

interface BulkBarProps<T> {
  table: DataTableInstance<T>;
  labels: DataTableLabels;
  bulkActions?: (selectedRows: T[], helpers: BulkActionHelpers) => ReactNode;
  className?: string;
}

export function BulkBar<T>({ table, labels, bulkActions, className }: BulkBarProps<T>) {
  const count = table.selectedKeys.length;
  const canSelectMore =
    table.selectionMode === 'multiple' &&
    !table.serverSide &&
    table.pageSelectionState === 'all' &&
    count < table.matchingSelectableCount;

  return (
    <div className={cx('cdt-bulkbar', className)}>
      <span className="cdt-bulkbar-count">{labels.selectedCount(count)}</span>
      {canSelectMore && (
        <button type="button" className="cdt-link" onClick={table.selectAllMatching}>
          {labels.selectAllMatching(table.matchingSelectableCount)}
        </button>
      )}
      <button type="button" className="cdt-link" onClick={table.clearSelection}>
        {labels.clearSelection}
      </button>
      {bulkActions && (
        <div className="cdt-bulkbar-actions">
          {bulkActions(table.selectedRows, {
            selectedKeys: table.selectedKeys,
            clearSelection: table.clearSelection,
          })}
        </div>
      )}
    </div>
  );
}
