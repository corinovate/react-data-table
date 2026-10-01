# Architecture

This document explains how `@corinovate/react-data-table` is designed and why. Read it before making non-trivial changes.

Guiding principle: **simple by default, powerful when needed.** `<DataTable data={rows} />` must produce a good-looking, working table. Every extra feature is opt-in through a prop with a sensible default.

## 1. Project layout

```
src/
  index.ts                  Public entry point (everything exported from here is public API)
  DataTable.tsx             The <DataTable> component: composes the hook, theme and views
  types.ts                  Public TypeScript types (Column, DataTableProps, SortItem, …)
  labels.ts                 Default UI strings (overridable for i18n)
  core/                     Pure, framework-free logic (easy to unit test)
    columns.ts              Column resolution + inference from data
    value.ts                getValue (dot paths), humanize, default cell formatting
    sort.ts                 Stable multi-column sort
    search.ts               Global text search
    paginate.ts             Page math + page-number items with ellipses
  hooks/
    useDataTable.ts         Headless table state + derived rows (the "engine")
    useControllableState.ts Controlled/uncontrolled state helper
    useDebouncedValue.ts
    useColorScheme.ts       light | dark | system
    useContainerWidth.ts    ResizeObserver-based width (drives responsive mode)
  themes/
    tokens.ts               ThemeTokens type + base light/dark tokens
    presets.ts              default, minimal, modern, compact, dark, glass
    createTheme.ts          createTheme() + resolveTheme() → CSS variables
  components/               Presentational pieces
    Toolbar.tsx, ColumnMenu.tsx, TableView.tsx, CardView.tsx,
    Pagination.tsx, BulkBar.tsx, StateMessage.tsx, Badge.tsx, icons.tsx
  styles.css                All styles; reads only --cdt-* CSS variables
examples/playground/        Vite app for local development and visual QA
test/                       Vitest + Testing Library tests
```

## 2. Component structure

```
<DataTable>                         .cdt  (theme CSS variables live here)
├── header (title / description)    optional
├── <Toolbar>                       search · filters slot · toolbarActions slot · <ColumnMenu>
├── <BulkBar>                       visible while rows are selected
├── container (scroll area)
│   ├── progress bar                while loading with existing rows
│   ├── <TableView>                 semantic <table>: thead (sort buttons) / tbody / expanded rows
│   └── <CardView>                  <ul> of cards on narrow containers when responsive="cards"
├── footer → <Pagination>           or renderPagination(ctx)
└── live region                     screen-reader announcements
```

`TableView` and `CardView` both consume the same headless instance from `useDataTable`, so a future `VirtualTableView` can be dropped in without touching state logic.

## 3. Public API

Exports: `DataTable`, `useDataTable`, `Pagination`, `Badge`, `renderBadge`, `createTheme`, `themes`, `defaultLabels`, plus pure helpers (`sortRows`, `searchRows`, `getValue`) and all types. Styles are a single import: `@corinovate/react-data-table/styles.css`.

## 4. Data / column API

```ts
interface Column<T> {
  key: string;                       // property name or dot path ("address.city"); also the column id
  header?: ReactNode | (ctx) => ReactNode;   // defaults to a humanized key
  label?: string;                    // plain-text name for menus, cards, aria (defaults from header/key)
  accessor?: (row) => unknown;       // derived values
  render?: (value, row, ctx) => ReactNode;
  sortable?, searchable?, hideable?, hidden?, hideOnMobile?, primary?
  compare?: (a, b) => number;        // custom sort
  searchValue?: (row) => string;     // custom search text
  align?, width?, minWidth?, className?, headerClassName?
}
```

`columns` is optional; they are inferred from the first row. Columns whose key doesn't map to data (e.g. an `actions` column) are automatically not sortable or searchable.

## 5. Theme architecture

* A theme is a set of **design tokens** (`ThemeTokens`): colors, radius, borders, shadows, spacing/density, row height, typography, header style, control sizes, motion, backdrop filter.
* Tokens become CSS custom properties (`accent` → `--cdt-accent`) set inline on the root element. `styles.css` only reads variables, so a theme can change shape and density as well as color.
* Each theme has light tokens and optional `darkTokens`. Resolution order: base light → theme light → base dark → theme dark. The `dark` preset sets `forcedMode: 'dark'`.
* `colorMode="light" | "dark" | "system"` works with every theme. `system` follows `prefers-color-scheme` live.
* `createTheme({ extends: 'modern', tokens: {...}, darkTokens: {...} })` builds custom themes. Plain CSS overrides (`.cdt { --cdt-accent: … }`) also work, and the root carries `data-cdt-theme` / `data-cdt-mode` attributes for targeting.

## 6. State management

* Plain React state, no external store. `useDataTable` owns search, sort, page, pageSize, selection, expansion and column visibility.
* Every piece is **controlled or uncontrolled** (`sort` / `defaultSort` / `onSortChange`, and so on), via `useControllableState`.
* Derived data is a memoized pipeline: `search → sort → paginate`. With `serverSide`, the pipeline is skipped and the table emits a single `onQueryChange({ page, pageSize, search, sort })` (search is debounced, page resets on search/sort/page-size change, duplicate queries are suppressed).
* Rows are identified by `rowKey` (default `row.id`, falling back to the index). Selection stores keys, so it survives sorting, paging and server refetches.

## 7. Dependencies

* Runtime: **none**.
* Peer: `react >= 18`, `react-dom >= 18` (uses `useId` and `useSyncExternalStore`).
* Dev: TypeScript, tsup, Vitest, Testing Library, jsdom, Vite (playground only).

## 8. Build and package

* `tsup` emits ESM (`dist/index.js`), CJS (`dist/index.cjs`), type declarations for both, sourcemaps, and `dist/styles.css`.
* `"use client"` banner so it works in the Next.js App Router.
* `exports` map with `types` conditions; `sideEffects` limited to CSS, so unused exports tree-shake away.

## 9. Testing strategy

* Unit tests for the pure `core/` functions (sorting, search, pagination, value access).
* Component tests with Testing Library covering the behaviors users rely on: rendering, inference, search, sorting/multi-sort and `aria-sort`, pagination, selection and bulk actions, expandable rows, row actions, loading/empty/error states, server-side query emission, theming variables and dark mode.
* Visual QA through the playground (`npm run dev`).

## 10. Documentation

`README.md` is the main documentation, ordered for a developer reading top to bottom: install → quick start → features one by one → themes → server-side → customization → accessibility → API reference → troubleshooting → about Corinovate.

## Future work (deliberately not in v1)

Virtualization (a `VirtualTableView` over the same engine), column resizing/reordering, column pinning, per-column filter UI, CSV export, row-actions dropdown menu.
