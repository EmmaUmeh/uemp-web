import { useState } from 'react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import { Select } from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import { courseService } from '../../api/services/course.service';
import { lecturerService } from '../../api/services/lecturer.service';
import { useFetch } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/formatters';

const columns = [
  { key: 'code', header: 'Code' },
  { key: 'title', header: 'Title' },
  { key: 'lecturerName', header: 'Assigned lecturer' },
];

export default function CourseAssignments() {
  const courses = useFetch(() => courseService.getCourses());
  const lecturers = useFetch(() => lecturerService.list());
  const [courseId, setCourseId] = useState('');
  const [lecturerId, setLecturerId] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const assign = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await courseService.assignLecturer(courseId, lecturerId);
      setNotice({ type: 'success', message: 'Lecturer assigned.' });
      setCourseId('');
      setLecturerId('');
      courses.reload();
    } catch (err) {
      setNotice({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader title="Course assignments" />
      <Alert type={notice?.type ?? 'success'} message={notice?.message ?? null} />
      <QueryBoundary loading={courses.loading || lecturers.loading} error={courses.error ?? lecturers.error} onRetry={() => { courses.reload(); lecturers.reload(); }}>
        <div className="mb-6 grid items-end gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-3">
          <Select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)} options={(courses.data ?? []).map((c) => ({ value: c.id, label: `${c.code} - ${c.title}` }))} />
          <Select label="Lecturer" value={lecturerId} onChange={(e) => setLecturerId(e.target.value)} options={(lecturers.data ?? []).map((l) => ({ value: l.id, label: String(l.name) }))} />
          <Button onClick={assign} loading={saving} disabled={!courseId || !lecturerId}>
            Assign lecturer
          </Button>
        </div>
        <DataTable columns={columns} rows={courses.data ?? []} />
      </QueryBoundary>
    </>
  );
}
