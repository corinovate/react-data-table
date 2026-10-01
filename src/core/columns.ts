import type { Column } from '../types';
import { getValue, humanize } from './value';

export interface ResolvedColumn<T = any> extends Column<T> {
  label: string;
  canSort: boolean;
  canSearch: boolean;
  canHide: boolean;
  read: (row: T) => unknown;
}

const SAMPLE_SIZE = 25;

/** Build columns from the keys of the first row when none are given. */
export function inferColumns<T>(data: T[]): Column<T>[] {
  const first = data.find((row) => row != null && typeof row === 'object');
  if (!first) return [];
  return Object.keys(first as object)
    .filter((key) => {
      const value = (first as Record<string, unknown>)[key];
      return value === null || typeof value !== 'object' || value instanceof Date || Array.isArray(value);
    })
    .map((key) => ({ key }));
}

/**
 * A column "maps to data" if it has an accessor or any sampled row has a value for its key.
 * Columns like `actions` that only render UI are then automatically not sortable or searchable.
 */
function mapsToData<T>(column: Column<T>, data: T[]): boolean {
  if (column.accessor || column.compare || column.searchValue) return true;
  if (data.length === 0) return !column.render;
  const sample = data.length > SAMPLE_SIZE ? data.slice(0, SAMPLE_SIZE) : data;
  return sample.some((row) => getValue(row, column.key) !== undefined);
}

export function resolveColumns<T>(
  columns: Column<T>[] | undefined,
  data: T[],
  tableSortable: boolean,
  tableSearchable: boolean,
): ResolvedColumn<T>[] {
  const source = columns ?? inferColumns(data);
  return source.map((column) => {
    const isData = mapsToData(column, data);
    const label =
      column.label ?? (typeof column.header === 'string' ? column.header : humanize(column.key));
    const accessor = column.accessor;
    return {
      ...column,
      label,
      canSort: tableSortable && (column.sortable ?? isData),
      canSearch: tableSearchable && (column.searchable ?? isData),
      canHide: column.hideable ?? true,
      read: accessor ? (row: T) => accessor(row) : (row: T) => getValue(row, column.key),
    };
  });
}
