import { useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import EmptyState from './EmptyState';
import { PAGE_SIZE } from '../../utils/constants';
import { formatValue } from '../../utils/formatters';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  searchable?: boolean;
  emptyMessage?: string;
  pageSize?: number;
}

export default function DataTable<T extends object>({
  columns,
  rows,
  searchable = true,
  emptyMessage,
  pageSize = PAGE_SIZE,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      columns.some((c) => formatValue((row as Record<string, unknown>)[c.key]).toLowerCase().includes(term))
    );
  }, [rows, query, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * pageSize, (current + 1) * pageSize);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {searchable && (
        <div className="no-print border-b border-gray-200 p-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search"
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      )}
      {visible.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-4 py-3 font-medium">
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3">
                      {c.render ? c.render(row) : formatValue((row as Record<string, unknown>)[c.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <div className="no-print flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
          <span>
            Page {current + 1} of {pages}
          </span>
          <div className="flex gap-1">
            <button disabled={current === 0} onClick={() => setPage(current - 1)} className="rounded border border-gray-300 p-1.5 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button disabled={current >= pages - 1} onClick={() => setPage(current + 1)} className="rounded border border-gray-300 p-1.5 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
