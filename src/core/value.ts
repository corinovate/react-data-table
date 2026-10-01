/** Read `row[key]`, supporting dot paths such as `"address.city"`. */
export function getValue(row: unknown, key: string): unknown {
  if (row == null || typeof row !== 'object') return undefined;
  const record = row as Record<string, unknown>;
  if (key in record) return record[key];
  if (!key.includes('.')) return undefined;
  let current: unknown = record;
  for (const part of key.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/** "firstName" → "First name", "created_at" → "Created at", "address.city" → "City". */
export function humanize(key: string): string {
  const last = key.split('.').pop() ?? key;
  const words = last
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim()
    .toLowerCase();
  if (words === 'id') return 'ID';
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

/** Text used for searching a raw cell value. */
export function toSearchText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : `${value.toISOString()} ${value.toLocaleDateString()}`;
  }
  if (Array.isArray(value)) return value.map(toSearchText).join(' ');
  return '';
}
