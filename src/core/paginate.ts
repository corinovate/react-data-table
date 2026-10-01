export function getPageCount(totalRows: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(totalRows / pageSize));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/**
 * Page buttons to show, always including first and last.
 * e.g. page 6 of 20 → [1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 20]
 */
export function getPageItems(page: number, pageCount: number, siblings = 1): PageItem[] {
  const slots = siblings * 2 + 5;
  if (pageCount <= slots) return Array.from({ length: pageCount }, (_, i) => i + 1);

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showStart = left > 3;
  const showEnd = right < pageCount - 2;
  const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

  if (!showStart) return [...range(1, 3 + siblings * 2), 'ellipsis-end', pageCount];
  if (!showEnd) return [1, 'ellipsis-start', ...range(pageCount - (2 + siblings * 2), pageCount)];
  return [1, 'ellipsis-start', ...range(left, right), 'ellipsis-end', pageCount];
}
