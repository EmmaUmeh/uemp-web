import ManagePage, { type FieldDef } from '../../components/common/ManagePage';
import { courseService } from '../../api/services/course.service';
import type { Row } from '../../types';
import type { Resource } from '../../api/services/resource';

const columns = [
  { key: 'code', header: 'Code' },
  { key: 'title', header: 'Title' },
  { key: 'creditUnits', header: 'Units' },
  { key: 'level', header: 'Level' },
  { key: 'semester', header: 'Semester' },
];

const fields: FieldDef[] = [
  { name: 'code', label: 'Course code', required: true },
  { name: 'title', label: 'Title', required: true },
  { name: 'creditUnits', label: 'Credit units', type: 'number', required: true },
  { name: 'level', label: 'Level', type: 'number', required: true },
  {
    name: 'semester',
    label: 'Semester',
    type: 'select',
    required: true,
    options: [
      { value: 'first', label: 'First' },
      { value: 'second', label: 'Second' },
    ],
  },
];

export default function Courses() {
  return (
    <ManagePage
      title="Courses"
      singular="Course"
      resource={courseService.resource as unknown as Resource<Row>}
      columns={columns}
      fields={fields}
      canDelete={false}
    />
  );
}
