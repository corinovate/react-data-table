import type { SortItem } from '../types';
import type { ResolvedColumn } from './columns';
import { isEmptyValue } from './value';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/** Compare two non-empty values in ascending order. */
export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'bigint' && typeof b === 'bigint') return a < b ? -1 : 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return a ? 1 : -1;
  return collator.compare(String(a), String(b));
}

/**
 * Stable multi-column sort. Empty values (null, undefined, '') always go last.
 * Returns the original array when there is nothing to sort.
 */
export function sortRows<T>(rows: T[], sort: SortItem[], columns: ResolvedColumn<T>[]): T[] {
  if (sort.length === 0 || rows.length < 2) return rows;
  const active = sort
    .map((item) => ({ item, column: columns.find((c) => c.key === item.key) }))
    .filter((entry): entry is { item: SortItem; column: ResolvedColumn<T> } =>
      Boolean(entry.column && entry.column.canSort),
    );
  if (active.length === 0) return rows;

  return [...rows].sort((rowA, rowB) => {
    for (const { item, column } of active) {
      const direction = item.direction === 'desc' ? -1 : 1;
      if (column.compare) {
        const result = column.compare(rowA, rowB);
        if (result !== 0) return result * direction;
        continue;
      }
      const a = column.read(rowA);
      const b = column.read(rowB);
      const aEmpty = isEmptyValue(a);
      const bEmpty = isEmptyValue(b);
      if (aEmpty || bEmpty) {
        if (aEmpty && bEmpty) continue;
        return aEmpty ? 1 : -1;
      }
      const result = compareValues(a, b);
      if (result !== 0) return result * direction;
    }
    return 0;
  });
}

/** Next sort state after a header click. Plain click: asc → desc → none. Additive (shift) keeps other columns. */
export function nextSort(sort: SortItem[], key: string, additive: boolean): SortItem[] {
  const existing = sort.find((s) => s.key === key);
  if (additive) {
    if (!existing) return [...sort, { key, direction: 'asc' }];
    if (existing.direction === 'asc') {
      return sort.map((s) => (s.key === key ? { key, direction: 'desc' } : s));
    }
    return sort.filter((s) => s.key !== key);
  }
  if (!existing) return [{ key, direction: 'asc' }];
  if (existing.direction === 'asc') return [{ key, direction: 'desc' }];
  return [];
}
