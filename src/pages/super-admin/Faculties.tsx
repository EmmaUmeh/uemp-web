import ManagePage from '../../components/common/ManagePage';
import { facultyService } from '../../api/services/department.service';

export default function Faculties() {
  return (
    <ManagePage
      title="Faculties"
      singular="Faculty"
      resource={facultyService}
      columns={[{ key: 'name', header: 'Name' }, { key: 'code', header: 'Code' }]}
      fields={[{ name: 'name', label: 'Name', required: true }, { name: 'code', label: 'Code' }]}
      canDelete={false}
    />
  );
}
