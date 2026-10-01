import type { SortItem, TableQuery } from '@corinovate/react-data-table';

export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'active' | 'pending' | 'suspended';
  revenue: number;
  joined: string;
  address: { city: string; country: string };
}

const first = ['Amara', 'Ben', 'Chen', 'Divya', 'Elena', 'Farid', 'Grace', 'Hiro', 'Isla', 'Jamal', 'Kofi', 'Lena', 'Mateo', 'Nadia', 'Omar', 'Priya'];
const last = ['Okafor', 'Silva', 'Wang', 'Patel', 'Rossi', 'Haddad', 'Kim', 'Tanaka', 'Murphy', 'Johnson', 'Mensah', 'Fischer', 'Garcia', 'Ali', 'Nguyen', 'Shah'];
const companies = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Stark Ltd', 'Wayne Group', 'Hooli', 'Vandelay'];
const cities: [string, string][] = [['Lagos', 'Nigeria'], ['London', 'UK'], ['Dubai', 'UAE'], ['Mumbai', 'India'], ['Austin', 'USA'], ['Berlin', 'Germany'], ['Tokyo', 'Japan'], ['Kuala Lumpur', 'Malaysia']];
const plans: Customer['plan'][] = ['Starter', 'Pro', 'Enterprise'];
const statuses: Customer['status'][] = ['active', 'active', 'active', 'pending', 'suspended'];

export const customers: Customer[] = Array.from({ length: 137 }, (_, i) => {
  const firstName = first[i % first.length];
  const lastName = last[(i * 7) % last.length];
  const [city, country] = cities[(i * 3) % cities.length];
  return {
    id: i + 1,
    name: `${firstName} ${lastName}`,
    email: `${firstName}.${lastName}${i}@example.com`.toLowerCase(),
    company: companies[(i * 5) % companies.length],
    plan: plans[(i * 11) % plans.length],
    status: statuses[(i * 13) % statuses.length],
    revenue: Math.round(((i * 7919) % 9000) + 500) * 10,
    joined: new Date(2021, (i * 5) % 12, ((i * 3) % 27) + 1).toISOString().slice(0, 10),
    address: { city, country },
  };
});

/** Fake API that searches, sorts and paginates on the "server". */
export function fetchCustomers(query: TableQuery): Promise<{ rows: Customer[]; total: number }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (query.search.toLowerCase() === 'error') return reject(new Error('The server returned 500. Try another search.'));
      const q = query.search.toLowerCase();
      let rows = customers.filter((c) => !q || `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q));
      rows = sortBy(rows, query.sort);
      const start = (query.page - 1) * query.pageSize;
      resolve({ rows: rows.slice(start, start + query.pageSize), total: rows.length });
    }, 600);
  });
}

function sortBy(rows: Customer[], sort: SortItem[]): Customer[] {
  if (!sort.length) return rows;
  return [...rows].sort((a, b) => {
    for (const { key, direction } of sort) {
      const av = a[key as keyof Customer];
      const bv = b[key as keyof Customer];
      const r = typeof av === 'number' ? (av as number) - (bv as number) : String(av).localeCompare(String(bv));
      if (r) return direction === 'asc' ? r : -r;
    }
    return 0;
  });
}
