import ManagePage, { type FieldDef } from '../../components/common/ManagePage';
import { lecturerService } from '../../api/services/lecturer.service';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'staffId', header: 'Staff ID' },
];

const fields: FieldDef[] = [
  { name: 'name', label: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'staffId', label: 'Staff ID' },
  { name: 'password', label: 'Password', type: 'password', required: true, createOnly: true },
];

export default function Lecturers() {
  return <ManagePage title="Lecturers" singular="Lecturer" resource={lecturerService} columns={columns} fields={fields} canDelete={false} />;
}
