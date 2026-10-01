import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Badge, DataTable } from '../src';
import type { Column, TableQuery } from '../src';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const users: User[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `User ${String(i + 1).padStart(2, '0')}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : 'Member',
  status: i % 2 === 0 ? 'active' : 'inactive',
}));

const columns: Column<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status', render: (value) => <Badge>{value}</Badge> },
];

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1]).queryAllByRole('row');
const firstCellTexts = () => bodyRows().map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('DataTable', () => {
  it('renders data with minimal config and infers columns', () => {
    render(<DataTable data={[{ id: 1, firstName: 'Ada', active: true }]} />);
    expect(screen.getByRole('columnheader', { name: 'First name' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Yes' })).toBeInTheDocument();
  });

  it('paginates 10 rows per page by default', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} />);
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText('1–10 of 23')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(bodyRows()).toHaveLength(3);
    expect(screen.getByText('21–23 of 23')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('changes page size', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} />);
    await user.selectOptions(screen.getByLabelText('Rows per page'), '25');
    expect(bodyRows()).toHaveLength(23);
  });

  it('can disable pagination', () => {
    render(<DataTable data={users} columns={columns} pagination={false} />);
    expect(bodyRows()).toHaveLength(23);
    expect(screen.queryByRole('navigation', { name: 'Pagination' })).not.toBeInTheDocument();
  });

  it('searches across columns and resets to page 1', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} />);
    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));
    await user.type(screen.getByRole('searchbox'), 'user2');
    expect(firstCellTexts()).toEqual(['User 02', 'User 20', 'User 21', 'User 22', 'User 23']);
    expect(screen.getByText('1–5 of 5')).toBeInTheDocument();
  });

  it('shows a no-results state with a clear button', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} />);
    await user.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText('No results for “zzz”')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear search' })[1]);
    expect(bodyRows()).toHaveLength(10);
  });

  it('sorts on header click and exposes aria-sort', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} />);
    const header = screen.getByRole('columnheader', { name: /Name/ });
    const button = within(header).getByRole('button');

    await user.click(button);
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(firstCellTexts()[0]).toBe('User 01');

    await user.click(button);
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(firstCellTexts()[0]).toBe('User 23');

    await user.click(button);
    expect(header).not.toHaveAttribute('aria-sort');
  });

  it('supports multi-column sort with shift-click', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<DataTable data={users} columns={columns} onSortChange={onSortChange} />);
    await user.click(within(screen.getByRole('columnheader', { name: /Role/ })).getByRole('button'));
    await user.keyboard('{Shift>}');
    await user.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    await user.keyboard('{/Shift}');
    expect(onSortChange).toHaveBeenLastCalledWith([
      { key: 'role', direction: 'asc' },
      { key: 'name', direction: 'asc' },
    ]);
    expect(firstCellTexts()[0]).toBe('User 01');
  });

  it('does not make render-only columns sortable', () => {
    render(
      <DataTable
        data={users}
        columns={[...columns, { key: 'actions', header: 'Actions', render: () => <button>Edit</button> }]}
      />,
    );
    const actions = screen.getByRole('columnheader', { name: 'Actions' });
    expect(within(actions).queryByRole('button')).not.toBeInTheDocument();
  });

  it('selects rows and runs bulk actions', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const onDelete = vi.fn();
    render(
      <DataTable
        data={users}
        columns={columns}
        selectable
        onSelectionChange={onSelectionChange}
        bulkActions={(rows, { clearSelection }) => (
          <button
            onClick={() => {
              onDelete(rows.map((r) => r.id));
              clearSelection();
            }}
          >
            Delete
          </button>
        )}
      />,
    );

    await user.click(screen.getAllByRole('checkbox', { name: 'Select row' })[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([2], [users[1]]);
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
    expect(screen.getByText('10 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Select all 23' }));
    expect(screen.getByText('23 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect([...onDelete.mock.calls[0][0]].sort((a, b) => a - b)).toEqual(users.map((u) => u.id));
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('supports single selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<DataTable data={users} columns={columns} selectable="single" onSelectionChange={onSelectionChange} />);
    const boxes = screen.getAllByRole('checkbox', { name: 'Select row' });
    await user.click(boxes[0]);
    await user.click(boxes[2]);
    expect(onSelectionChange).toHaveBeenLastCalledWith([3], [users[2]]);
  });

  it('toggles selection with the keyboard', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} selectable />);
    bodyRows()[0].focus();
    await user.keyboard(' ');
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    await user.keyboard('{ArrowDown} ');
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('renders row actions and keeps them from triggering row clicks', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onRowClick = vi.fn();
    render(
      <DataTable
        data={users.slice(0, 2)}
        columns={columns}
        onRowClick={onRowClick}
        rowActions={[
          { label: 'Edit', onClick: onEdit },
          { label: 'Delete', onClick: vi.fn(), variant: 'danger', hidden: (row) => row.id === 1 },
        ]}
      />,
    );
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    expect(onEdit).toHaveBeenCalledWith(users[0]);
    expect(onRowClick).not.toHaveBeenCalled();

    await user.click(screen.getByRole('cell', { name: 'User 02' }));
    expect(onRowClick).toHaveBeenCalledWith(users[1], expect.anything());
  });

  it('expands rows', async () => {
    const user = userEvent.setup();
    render(
      <DataTable data={users.slice(0, 3)} columns={columns} renderExpanded={(row) => <p>Details for {row.name}</p>} />,
    );
    const toggle = screen.getAllByRole('button', { name: 'Expand row' })[0];
    await user.click(toggle);
    expect(screen.getByText('Details for User 01')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Collapse row' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('hides and shows columns from the column menu', async () => {
    const user = userEvent.setup();
    render(<DataTable data={users} columns={columns} />);
    await user.click(screen.getByRole('button', { name: /Columns/ }));
    await user.click(screen.getByRole('checkbox', { name: 'Email' }));
    expect(screen.queryByRole('columnheader', { name: /Email/ })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('checkbox', { name: 'Email' })).not.toBeInTheDocument();
  });

  it('respects initially hidden columns', () => {
    render(<DataTable data={users} columns={[...columns, { key: 'id', hidden: true }]} />);
    expect(screen.queryByRole('columnheader', { name: /ID/ })).not.toBeInTheDocument();
  });

  it('shows loading skeletons, empty and error states', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender, container } = render(<DataTable data={[]} columns={columns} loading />);
    expect(container.querySelectorAll('.cdt-skeleton-row').length).toBeGreaterThan(0);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');

    rerender(<DataTable data={[]} columns={columns} />);
    expect(screen.getByText('No data to display')).toBeInTheDocument();

    rerender(<DataTable data={[]} columns={columns} emptyState={<p>No users yet</p>} />);
    expect(screen.getByText('No users yet')).toBeInTheDocument();

    rerender(<DataTable data={[]} columns={columns} error={new Error('Network down')} onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network down');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('keeps rows visible while reloading', () => {
    render(<DataTable data={users} columns={columns} loading />);
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('applies theme variables and color mode', () => {
    const { container, rerender } = render(<DataTable data={users} columns={columns} theme="compact" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-cdt-theme', 'compact');
    expect(root).toHaveAttribute('data-cdt-mode', 'light');
    expect(root.style.getPropertyValue('--cdt-cell-padding-y')).toBe('6px');

    rerender(<DataTable data={users} columns={columns} theme="modern" colorMode="dark" />);
    expect(root).toHaveAttribute('data-cdt-mode', 'dark');
    expect(root.style.getPropertyValue('--cdt-radius')).toBe('18px');
  });

  it('uses the title as the accessible name', () => {
    render(<DataTable data={users} columns={columns} title="Customers" />);
    expect(screen.getByRole('table', { name: 'Customers' })).toBeInTheDocument();
  });

  it('accepts custom labels', () => {
    render(<DataTable data={users} columns={columns} labels={{ rowsPerPage: 'Filas por página' }} />);
    expect(screen.getByLabelText('Filas por página')).toBeInTheDocument();
  });

  it('supports a custom pagination renderer', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        data={users}
        columns={columns}
        renderPagination={({ page, pageCount, setPage }) => (
          <button onClick={() => setPage(page + 1)}>
            More ({page}/{pageCount})
          </button>
        )}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'More (1/3)' }));
    expect(screen.getByRole('button', { name: 'More (2/3)' })).toBeInTheDocument();
  });
});

describe('DataTable server-side', () => {
  it('emits one query on mount and on each change, without processing data locally', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onQueryChange = vi.fn<(q: TableQuery) => void>();
    const page = users.slice(0, 10);

    render(
      <DataTable data={page} columns={columns} serverSide totalRows={95} onQueryChange={onQueryChange} />,
    );
    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenLastCalledWith({ page: 1, pageSize: 10, search: '', sort: [] });
    expect(screen.getByText('1–10 of 95')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(onQueryChange).toHaveBeenLastCalledWith({ page: 2, pageSize: 10, search: '', sort: [] });

    await user.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    expect(onQueryChange).toHaveBeenLastCalledWith({
      page: 1,
      pageSize: 10,
      search: '',
      sort: [{ key: 'name', direction: 'asc' }],
    });
    // Data is shown as given (the server sorts it).
    expect(firstCellTexts()[0]).toBe('User 01');

    const callsBeforeTyping = onQueryChange.mock.calls.length;
    await user.type(screen.getByRole('searchbox'), 'ada');
    expect(onQueryChange).toHaveBeenCalledTimes(callsBeforeTyping);
    await act(async () => {
      vi.advanceTimersByTime(350);
    });
    expect(onQueryChange).toHaveBeenCalledTimes(callsBeforeTyping + 1);
    expect(onQueryChange.mock.lastCall![0].search).toBe('ada');
    vi.useRealTimers();
  });

  it('works with controlled state', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = useState(2);
      return (
        <>
          <span data-testid="page">{page}</span>
          <DataTable data={users} columns={columns} page={page} onPageChange={setPage} />
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByText('11–20 of 23')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByTestId('page')).toHaveTextContent('3');
  });
});
