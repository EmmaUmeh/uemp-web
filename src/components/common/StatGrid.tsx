import StatCard from './StatCard';
import DataTable, { type Column } from './DataTable';
import { formatValue, humanize } from '../../utils/formatters';
import type { DashboardData } from '../../types';

function isRowArray(value: unknown): value is Record<string, unknown>[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'object' && v !== null);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function columnsFor(rows: Record<string, unknown>[]): Column<Record<string, unknown>>[] {
  const keys = Array.from(new Set(rows.flatMap((r) => Object.keys(r)))).filter((k) => k !== 'id' && k !== '_id');
  return keys.map((key) => ({ key, header: humanize(key) }));
}

export default function StatGrid({ data }: { data: DashboardData }) {
  const stats: { label: string; value: string }[] = [];
  const tables: { label: string; rows: Record<string, unknown>[] }[] = [];

  Object.entries(data).forEach(([key, value]) => {
    if (isRowArray(value)) {
      tables.push({ label: humanize(key), rows: value });
    } else if (isPlainObject(value)) {
      Object.entries(value).forEach(([k, v]) => stats.push({ label: `${humanize(key)} ${k}`, value: formatValue(v) }));
    } else {
      stats.push({ label: humanize(key), value: formatValue(value) });
    }
  });

  return (
    <div className="space-y-6">
      {stats.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      )}
      {tables.map((t) => (
        <section key={t.label}>
          <h2 className="mb-2 text-base font-semibold">{t.label}</h2>
          <DataTable columns={columnsFor(t.rows)} rows={t.rows} searchable={false} />
        </section>
      ))}
    </div>
  );
}
