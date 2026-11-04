import ManagePage from '../../components/common/ManagePage';
import { programService } from '../../api/services/department.service';

export default function Programs() {
  return (
    <ManagePage
      title="Programs"
      singular="Program"
      resource={programService}
      columns={[{ key: 'name', header: 'Name' }, { key: 'departmentName', header: 'Department' }, { key: 'duration', header: 'Duration (years)' }]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'departmentId', label: 'Department ID', required: true },
        { name: 'duration', label: 'Duration (years)', type: 'number' },
      ]}
      canDelete={false}
    />
  );
}
