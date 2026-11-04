import { useState } from 'react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import DataTable, { type Column } from '../../components/common/DataTable';
import { Select } from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import { courseService } from '../../api/services/course.service';
import { registrationService } from '../../api/services/registration.service';
import { useFetch } from '../../hooks/useFetch';
import { totalUnits } from '../../utils/academic';
import { getErrorMessage } from '../../utils/formatters';
import type { Course } from '../../types';

export default function AvailableCourses() {
  const [semester, setSemester] = useState('');
  const [level, setLevel] = useState('');
  const [selected, setSelected] = useState<Course[]>([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const { data, loading, error, reload } = useFetch(
    () => courseService.getAvailableCourses({ semester: semester || undefined, level: level || undefined }),
    [semester, level]
  );

  const isSelected = (id: string) => selected.some((c) => c.id === id);
  const toggle = (course: Course) =>
    setSelected((prev) => (prev.some((c) => c.id === course.id) ? prev.filter((c) => c.id !== course.id) : [...prev, course]));

  const columns: Column<Course>[] = [
    {
      key: 'select',
      header: '',
      render: (c) => <input type="checkbox" checked={isSelected(c.id)} onChange={() => toggle(c)} aria-label={`Select ${c.code}`} />,
    },
    { key: 'code', header: 'Code' },
    { key: 'title', header: 'Title' },
    { key: 'creditUnits', header: 'Units' },
    { key: 'level', header: 'Level' },
    { key: 'semester', header: 'Semester' },
  ];

  const register = async () => {
    setSaving(true);
    setNotice(null);
    try {
      await registrationService.registerCourses(selected.map((c) => c.id));
      setNotice({ type: 'success', message: 'Courses registered.' });
      setSelected([]);
      reload();
    } catch (err) {
      setNotice({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Available courses"
        actions={
          <Button onClick={register} loading={saving} disabled={selected.length === 0}>
            Register {selected.length} course{selected.length === 1 ? '' : 's'} ({totalUnits(selected)} units)
          </Button>
        }
      />
      <Alert type={notice?.type ?? 'success'} message={notice?.message ?? null} />
      <div className="mb-4 grid max-w-md grid-cols-2 gap-4">
        <Select label="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} options={[{ value: 'first', label: 'First' }, { value: 'second', label: 'Second' }]} />
        <Select label="Level" value={level} onChange={(e) => setLevel(e.target.value)} options={[100, 200, 300, 400, 500].map((l) => ({ value: String(l), label: String(l) }))} />
      </div>
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        <DataTable columns={columns} rows={data ?? []} />
      </QueryBoundary>
    </>
  );
}
