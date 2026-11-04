import type { DashboardData } from '../../types';
import { useFetch } from '../../hooks/useFetch';
import PageHeader from './PageHeader';
import QueryBoundary from './QueryBoundary';
import EmptyState from './EmptyState';
import StatGrid from './StatGrid';

interface DataViewProps {
  title: string;
  description?: string;
  fetcher: () => Promise<DashboardData>;
}

export default function DataView({ title, description, fetcher }: DataViewProps) {
  const { data, loading, error, reload } = useFetch(fetcher);
  const empty = !data || Object.keys(data).length === 0;
  return (
    <>
      <PageHeader title={title} description={description} />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        {empty ? <EmptyState /> : <StatGrid data={data} />}
      </QueryBoundary>
    </>
  );
}
