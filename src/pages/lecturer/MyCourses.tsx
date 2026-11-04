import { Link } from 'react-router-dom';
import DataTable, { type Column } from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import { lecturerService } from '../../api/services/lecturer.service';
import { useFetch } from '../../hooks/useFetch';
import type { Course } from '../../types';

const columns: Column<Course>[] = [
  { key: 'code', header: 'Code' },
  { key: 'title', header: 'Title' },
  { key: 'creditUnits', header: 'Units' },
  {
    key: 'links',
    header: 'Open',
    render: (c) => (
      <div className="flex gap-3 text-accent">
        <Link to={`/lecturer/class-list/${c.id}`} className="hover:underline">
          Class list
        </Link>
        <Link to={`/lecturer/results/${c.id}`} className="hover:underline">
          Results
        </Link>
      </div>
    ),
  },
];

export default function MyCourses() {
  const { data, loading, error, reload } = useFetch(() => lecturerService.getAssignedCourses());
  return (
    <>
      <PageHeader title="My courses" />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        <DataTable columns={columns} rows={data ?? []} />
      </QueryBoundary>
    </>
  );
}
