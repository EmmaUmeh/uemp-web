import { useParams } from 'react-router-dom';
import CoursePicker from '../../components/common/CoursePicker';
import DataTable from '../../components/common/DataTable';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import { lecturerService } from '../../api/services/lecturer.service';
import { useFetch } from '../../hooks/useFetch';

const columns = [
  { key: 'matricNumber', header: 'Matric number' },
  { key: 'name', header: 'Name' },
  { key: 'level', header: 'Level' },
];

function Students({ courseId }: { courseId: string }) {
  const { data, loading, error, reload } = useFetch(() => lecturerService.getClassList(courseId), [courseId]);
  return (
    <QueryBoundary loading={loading} error={error} onRetry={reload}>
      <p className="mb-3 text-sm text-gray-600">Registered students: {data?.length ?? 0}</p>
      <DataTable columns={columns} rows={data ?? []} />
    </QueryBoundary>
  );
}

export default function ClassList() {
  const { courseId } = useParams();
  return (
    <>
      <PageHeader title="Class list" />
      <CoursePicker basePath="/lecturer/class-list" value={courseId} />
      {courseId && <Students courseId={courseId} />}
    </>
  );
}
