import { Printer } from 'lucide-react';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import StatGrid from '../../components/common/StatGrid';
import { registrationService } from '../../api/services/registration.service';
import { useFetch } from '../../hooks/useFetch';
import { totalUnits } from '../../utils/academic';

const columns = [
  { key: 'code', header: 'Code' },
  { key: 'title', header: 'Title' },
  { key: 'creditUnits', header: 'Units' },
];

export default function RegisteredCourses() {
  const courses = useFetch(() => registrationService.getRegisteredCourses());
  const summary = useFetch(() => registrationService.getRegistrationSummary());

  return (
    <>
      <PageHeader
        title="Registered courses"
        actions={
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print summary
          </Button>
        }
      />
      <QueryBoundary loading={courses.loading} error={courses.error} onRetry={courses.reload}>
        <p className="mb-3 text-sm text-gray-600">Total credit units: {totalUnits(courses.data ?? [])}</p>
        <DataTable columns={columns} rows={courses.data ?? []} searchable={false} />
      </QueryBoundary>
      {summary.data && (
        <div className="mt-6">
          <StatGrid data={summary.data} />
        </div>
      )}
    </>
  );
}
