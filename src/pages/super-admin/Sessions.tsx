import ManagePage from '../../components/common/ManagePage';
import StatusBadge from '../../components/common/StatusBadge';
import { periodService } from '../../api/services/department.service';

export default function Sessions() {
  return (
    <ManagePage
      title="Academic periods"
      singular="Period"
      resource={periodService}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'startDate', header: 'Start' },
        { key: 'endDate', header: 'End' },
        { key: 'isActive', header: 'Status', render: (r) => <StatusBadge status={r.isActive ? 'active' : 'inactive'} /> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'startDate', label: 'Start date', type: 'date' },
        { name: 'endDate', label: 'End date', type: 'date' },
      ]}
      canDelete={false}
    />
  );
}
