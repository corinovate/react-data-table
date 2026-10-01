import { useEffect, useState } from 'react';
import { DataTable, createTheme, renderBadge } from '@corinovate/react-data-table';
import type { ColorMode, Column, ResponsiveMode, TableQuery, ThemeName } from '@corinovate/react-data-table';
import { customers, fetchCustomers } from './data';
import type { Customer } from './data';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const columns: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Customer',
    primary: true,
    render: (_, row) => (
      <div className="pg-person">
        <span className="pg-avatar" aria-hidden="true">
          {row.name.split(' ').map((p) => p[0]).join('')}
        </span>
        <span>
          <strong>{row.name}</strong>
          <small>{row.email}</small>
        </span>
      </div>
    ),
    searchValue: (row) => `${row.name} ${row.email}`,
  },
  { key: 'company', header: 'Company', hideOnMobile: true },
  { key: 'plan', header: 'Plan', render: renderBadge({ Enterprise: 'accent', Pro: 'info', Starter: 'neutral' }, { dot: false }) },
  { key: 'status', header: 'Status', render: renderBadge({ active: 'success', pending: 'warning', suspended: 'danger' }) },
  { key: 'revenue', header: 'Revenue', align: 'right', render: (v: number) => currency.format(v) },
  { key: 'address.city', header: 'City' },
  { key: 'joined', header: 'Joined', hidden: true },
];

const brandTheme = createTheme({
  extends: 'modern',
  name: 'corinovate',
  tokens: { accent: '#0f766e', radius: '14px' },
  darkTokens: { accent: '#2dd4bf', accentText: '#042f2e' },
});

const themeNames: (ThemeName | 'corinovate')[] = ['default', 'minimal', 'modern', 'compact', 'dark', 'glass', 'corinovate'];

const params = new URLSearchParams(window.location.search);

export function App() {
  const [theme, setTheme] = useState<ThemeName | 'corinovate'>((params.get('theme') as ThemeName) ?? 'default');
  const [colorMode, setColorMode] = useState<ColorMode>((params.get('mode') as ColorMode) ?? 'light');
  const [responsive, setResponsive] = useState<ResponsiveMode>((params.get('responsive') as ResponsiveMode) ?? 'cards');
  const [narrow, setNarrow] = useState(params.has('narrow'));
  const [status, setStatus] = useState('all');
  const [log, setLog] = useState('');

  const dark = colorMode === 'dark' || theme === 'dark';
  const filtered = status === 'all' ? customers : customers.filter((c) => c.status === status);

  return (
    <div className="pg" data-dark={dark || undefined} data-glass={theme === 'glass' || undefined}>
      <header className="pg-header">
        <div>
          <h1>@corinovate/react-data-table</h1>
          <p>Simple by default. Powerful when needed.</p>
        </div>
        <div className="pg-controls">
          <label>
            Theme
            <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}>
              {themeNames.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Mode
            <select value={colorMode} onChange={(e) => setColorMode(e.target.value as ColorMode)}>
              <option>light</option>
              <option>dark</option>
              <option>system</option>
            </select>
          </label>
          <label>
            Responsive
            <select value={responsive} onChange={(e) => setResponsive(e.target.value as ResponsiveMode)}>
              <option>cards</option>
              <option>scroll</option>
              <option>compact</option>
            </select>
          </label>
          <label className="pg-check">
            <input type="checkbox" checked={narrow} onChange={(e) => setNarrow(e.target.checked)} /> Phone width
          </label>
        </div>
      </header>

      <main className="pg-main" style={narrow ? { maxWidth: 390 } : undefined}>
        <section>
          <h2>Full-featured client-side table</h2>
          <DataTable
            title="Customers"
            description="Search, multi-sort (shift-click), select, expand, hide columns."
            data={filtered}
            columns={columns}
            theme={theme === 'corinovate' ? brandTheme : theme}
            colorMode={colorMode}
            responsive={responsive}
            selectable
            stickyHeader
            maxHeight={520}
            onRowClick={(row) => setLog(`Clicked ${row.name}`)}
            filters={
              <select className="cdt-select" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            }
            toolbarActions={
              <button type="button" className="cdt-btn cdt-btn--primary" onClick={() => setLog('Add customer')}>
                + Add customer
              </button>
            }
            rowActions={[
              { label: 'Edit', onClick: (row) => setLog(`Edit ${row.name}`) },
              { label: 'Delete', variant: 'danger', onClick: (row) => setLog(`Delete ${row.name}`), disabled: (row) => row.status === 'active' },
            ]}
            bulkActions={(rows, { clearSelection }) => (
              <>
                <button type="button" className="cdt-btn cdt-btn--sm" onClick={() => setLog(`Export ${rows.length} rows`)}>
                  Export
                </button>
                <button
                  type="button"
                  className="cdt-btn cdt-btn--sm cdt-btn--danger"
                  onClick={() => {
                    setLog(`Delete ${rows.length} rows`);
                    clearSelection();
                  }}
                >
                  Delete
                </button>
              </>
            )}
            renderExpanded={(row) => (
              <div className="pg-details">
                <div><span>Customer ID</span>#{row.id}</div>
                <div><span>Country</span>{row.address.country}</div>
                <div><span>Joined</span>{row.joined}</div>
                <div><span>Lifetime value</span>{currency.format(row.revenue * 3)}</div>
              </div>
            )}
          />
          <p className="pg-log" aria-live="polite">{log || 'Interact with the table…'}</p>
        </section>

        <section>
          <h2>Server-side data (try searching “error”)</h2>
          <ServerSideExample theme={theme === 'corinovate' ? brandTheme : theme} colorMode={colorMode} responsive={responsive} />
        </section>

        <section>
          <h2>Zero config</h2>
          <DataTable
            data={customers.slice(0, 6).map(({ id, name, company, plan, revenue }) => ({ id, name, company, plan, revenue }))}
            theme={theme === 'corinovate' ? brandTheme : theme}
            colorMode={colorMode}
          />
        </section>
      </main>
    </div>
  );
}

function ServerSideExample({ theme, colorMode, responsive }: { theme: any; colorMode: ColorMode; responsive: ResponsiveMode }) {
  const [query, setQuery] = useState<TableQuery | null>(null);
  const [result, setResult] = useState<{ rows: Customer[]; total: number }>({ rows: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCustomers(query)
      .then((r) => !cancelled && setResult(r))
      .catch((e) => !cancelled && setError(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query, attempt]);

  return (
    <DataTable
      serverSide
      data={result.rows}
      totalRows={result.total}
      loading={loading}
      error={error}
      onRetry={() => setAttempt((a) => a + 1)}
      onQueryChange={setQuery}
      columns={columns.slice(0, 5)}
      theme={theme}
      colorMode={colorMode}
      responsive={responsive}
      ariaLabel="Server-side customers"
    />
  );
}
