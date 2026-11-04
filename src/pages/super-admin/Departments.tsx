import ManagePage from '../../components/common/ManagePage';
import { departmentService } from '../../api/services/department.service';

export default function Departments() {
  return (
    <ManagePage
      title="Departments"
      singular="Department"
      resource={departmentService}
      columns={[{ key: 'name', header: 'Name' }, { key: 'code', header: 'Code' }, { key: 'facultyName', header: 'Faculty' }]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'code', label: 'Code' },
        { name: 'facultyId', label: 'Faculty ID', required: true },
      ]}
      canDelete={false}
    />
  );
}
