import { describe, expect, it } from 'vitest';
import { resolveColumns } from '../src/core/columns';
import { getPageItems } from '../src/core/paginate';
import { searchRows } from '../src/core/search';
import { nextSort, sortRows } from '../src/core/sort';
import { getValue, humanize } from '../src/core/value';
import { createTheme, resolveTheme } from '../src/themes/createTheme';

const rows = [
  { id: 1, name: 'Charlie', age: 30, team: { name: 'Sales' }, joined: new Date('2024-03-01') },
  { id: 2, name: 'alice', age: 25, team: { name: 'Support' }, joined: new Date('2023-01-15') },
  { id: 3, name: 'Bob', age: null, team: { name: 'Sales' }, joined: new Date('2025-07-20') },
  { id: 4, name: 'item 10', age: 30, team: { name: 'Ops' }, joined: new Date('2022-11-02') },
  { id: 5, name: 'item 9', age: 41, team: { name: 'Ops' }, joined: new Date('2024-01-01') },
];
const columns = resolveColumns(
  [
    { key: 'name' },
    { key: 'age' },
    { key: 'team.name', header: 'Team' },
    { key: 'joined' },
    { key: 'actions', render: () => null },
  ],
  rows,
  true,
  true,
);

describe('getValue', () => {
  it('reads keys and dot paths', () => {
    expect(getValue(rows[0], 'name')).toBe('Charlie');
    expect(getValue(rows[0], 'team.name')).toBe('Sales');
    expect(getValue(rows[0], 'missing.path')).toBeUndefined();
    expect(getValue({ 'a.b': 1 }, 'a.b')).toBe(1);
  });
});

describe('humanize', () => {
  it('turns keys into labels', () => {
    expect(humanize('firstName')).toBe('First name');
    expect(humanize('created_at')).toBe('Created at');
    expect(humanize('address.city')).toBe('City');
    expect(humanize('id')).toBe('ID');
  });
});

describe('resolveColumns', () => {
  it('disables sort and search on columns without data', () => {
    const actions = columns.find((c) => c.key === 'actions')!;
    expect(actions.canSort).toBe(false);
    expect(actions.canSearch).toBe(false);
    expect(columns.find((c) => c.key === 'name')!.canSort).toBe(true);
  });

  it('infers columns from data', () => {
    const inferred = resolveColumns(undefined, [{ id: 1, fullName: 'A', meta: { x: 1 } }], true, true);
    expect(inferred.map((c) => c.label)).toEqual(['ID', 'Full name']);
  });
});

describe('sortRows', () => {
  it('sorts strings case-insensitively and numerically', () => {
    const sorted = sortRows(rows, [{ key: 'name', direction: 'asc' }], columns);
    expect(sorted.map((r) => r.name)).toEqual(['alice', 'Bob', 'Charlie', 'item 9', 'item 10']);
  });

  it('puts empty values last in both directions', () => {
    expect(sortRows(rows, [{ key: 'age', direction: 'asc' }], columns)[4].name).toBe('Bob');
    expect(sortRows(rows, [{ key: 'age', direction: 'desc' }], columns)[4].name).toBe('Bob');
  });

  it('sorts by several columns', () => {
    const sorted = sortRows(
      rows,
      [
        { key: 'age', direction: 'desc' },
        { key: 'name', direction: 'asc' },
      ],
      columns,
    );
    expect(sorted.map((r) => r.id)).toEqual([5, 1, 4, 2, 3]);
  });

  it('sorts dates and nested values', () => {
    expect(sortRows(rows, [{ key: 'joined', direction: 'asc' }], columns)[0].id).toBe(4);
    expect(sortRows(rows, [{ key: 'team.name', direction: 'asc' }], columns)[0].team.name).toBe('Ops');
  });

  it('does not mutate the input', () => {
    const copy = [...rows];
    sortRows(rows, [{ key: 'name', direction: 'desc' }], columns);
    expect(rows).toEqual(copy);
  });
});

describe('nextSort', () => {
  it('cycles asc → desc → none', () => {
    expect(nextSort([], 'a', false)).toEqual([{ key: 'a', direction: 'asc' }]);
    expect(nextSort([{ key: 'a', direction: 'asc' }], 'a', false)).toEqual([{ key: 'a', direction: 'desc' }]);
    expect(nextSort([{ key: 'a', direction: 'desc' }], 'a', false)).toEqual([]);
  });

  it('adds columns when additive', () => {
    expect(nextSort([{ key: 'a', direction: 'asc' }], 'b', true)).toEqual([
      { key: 'a', direction: 'asc' },
      { key: 'b', direction: 'asc' },
    ]);
  });
});

describe('searchRows', () => {
  it('matches every term across columns, case-insensitively', () => {
    expect(searchRows(rows, 'sales', columns).map((r) => r.id)).toEqual([1, 3]);
    expect(searchRows(rows, 'SALES bob', columns).map((r) => r.id)).toEqual([3]);
    expect(searchRows(rows, '  ', columns)).toBe(rows);
  });

  it('uses a custom search function', () => {
    expect(searchRows(rows, 'x', columns, (r) => r.id === 2).map((r) => r.id)).toEqual([2]);
  });
});

describe('getPageItems', () => {
  it('shows every page when there are few', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('adds ellipses around the current page', () => {
    expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPageItems(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
    expect(getPageItems(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });
});

describe('themes', () => {
  it('resolves tokens to CSS variables', () => {
    const { style, mode } = resolveTheme('compact', 'light');
    expect(mode).toBe('light');
    expect(style['--cdt-cell-padding-y']).toBe('6px');
    expect(style['--cdt-row-hover-background']).toBeDefined();
  });

  it('applies dark tokens and keeps layout tokens', () => {
    const { style, mode } = resolveTheme('modern', 'dark');
    expect(mode).toBe('dark');
    expect(style['--cdt-radius']).toBe('18px');
    expect(style['--cdt-text']).toBe('#e8eaee');
  });

  it('forces dark for the dark preset', () => {
    expect(resolveTheme('dark', 'light').mode).toBe('dark');
  });

  it('extends presets with createTheme', () => {
    const brand = createTheme({ extends: 'modern', name: 'brand', tokens: { accent: '#e11d48' } });
    const { style, name } = resolveTheme(brand, 'light');
    expect(name).toBe('brand');
    expect(style['--cdt-accent']).toBe('#e11d48');
    expect(style['--cdt-radius']).toBe('18px');
  });
});
