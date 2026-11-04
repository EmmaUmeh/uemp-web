import DataTable from '../../components/common/DataTable';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import StatGrid from '../../components/common/StatGrid';
import { resultService } from '../../api/services/result.service';
import { useFetch } from '../../hooks/useFetch';
import { computeGpa } from '../../utils/academic';
import type { Result } from '../../types';

const columns = [
  { key: 'courseCode', header: 'Code' },
  { key: 'courseTitle', header: 'Title' },
  { key: 'creditUnits', header: 'Units' },
  { key: 'total', header: 'Score' },
  { key: 'grade', header: 'Grade' },
  { key: 'gradePoint', header: 'Grade point' },
];

function groupByTerm(results: Result[]): Record<string, Result[]> {
  return results.reduce<Record<string, Result[]>>((acc, r) => {
    const key = [r.session, r.semester].filter(Boolean).join(' - ') || 'Results';
    (acc[key] ??= []).push(r);
    return acc;
  }, {});
}

export default function Results() {
  const results = useFetch(() => resultService.getResults());
  const summary = useFetch(() => resultService.getAcademicSummary());
  const approved = (results.data ?? []).filter((r) => r.status === 'approved');
  const groups = groupByTerm(approved);

  return (
    <>
      <PageHeader title="Results" description="Only approved results are shown." />
      {summary.data && (
        <div className="mb-6">
          <StatGrid data={summary.data} />
        </div>
      )}
      <QueryBoundary loading={results.loading} error={results.error} onRetry={results.reload}>
        {approved.length === 0 ? (
          <EmptyState message="No approved results yet." />
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([term, rows]) => (
              <section key={term}>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-base font-semibold">{term}</h2>
                  <span className="text-sm text-gray-600">GPA: {computeGpa(rows) ?? '-'}</span>
                </div>
                <DataTable columns={columns} rows={rows} searchable={false} />
              </section>
            ))}
          </div>
        )}
      </QueryBoundary>
    </>
  );
}
