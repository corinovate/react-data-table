import type { ResolvedColumn } from './columns';
import { toSearchText } from './value';

/**
 * Case-insensitive search across searchable columns.
 * Every whitespace-separated term must match somewhere in the row ("jane admin").
 */
export function searchRows<T>(
  rows: T[],
  query: string,
  columns: ResolvedColumn<T>[],
  searchFn?: (row: T, query: string) => boolean,
): T[] {
  const trimmed = query.trim();
  if (!trimmed) return rows;
  if (searchFn) return rows.filter((row) => searchFn(row, trimmed));

  const terms = trimmed.toLowerCase().split(/\s+/);
  const searchable = columns.filter((c) => c.canSearch);
  return rows.filter((row) => {
    const haystack = searchable
      .map((c) => (c.searchValue ? c.searchValue(row) : toSearchText(c.read(row))))
      .join('\u0000')
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
