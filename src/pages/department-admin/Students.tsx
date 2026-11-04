import ManagePage, { type FieldDef } from '../../components/common/ManagePage';
import { studentService } from '../../api/services/student.service';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'matricNumber', header: 'Matric number' },
  { key: 'email', header: 'Email' },
  { key: 'level', header: 'Level' },
];

const fields: FieldDef[] = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'matricNumber', label: 'Matric number', required: true },
  { name: 'level', label: 'Level', type: 'number', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true, createOnly: true },
];

export default function Students() {
  return <ManagePage title="Students" singular="Student" resource={studentService} columns={columns} fields={fields} canDelete={false} />;
}
