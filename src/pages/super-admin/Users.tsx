import ManagePage from '../../components/common/ManagePage';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { userService } from '../../api/services/user.service';
import { getErrorMessage } from '../../utils/formatters';

export default function Users() {
  return (
    <ManagePage
      title="Users"
      singular="User"
      resource={userService}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'role', header: 'Role' },
        { key: 'isActive', header: 'Status', render: (r) => <StatusBadge status={r.isActive === false ? 'inactive' : 'active'} /> },
      ]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          required: true,
          options: [
            { value: 'student', label: 'Student' },
            { value: 'lecturer', label: 'Lecturer' },
            { value: 'department_admin', label: 'Department Admin' },
            { value: 'super_admin', label: 'Super Admin' },
          ],
        },
        { name: 'password', label: 'Password', type: 'password', required: true, createOnly: true },
      ]}
      canDelete={false}
      rowActions={(row, reload, notify) => {
        const active = row.isActive !== false;
        return (
          <Button
            variant="secondary"
            className="px-2 py-1 text-xs"
            onClick={async () => {
              try {
                await userService.setActive(row.id, !active);
                notify('success', `Account ${active ? 'deactivated' : 'activated'}.`);
                reload();
              } catch (err) {
                notify('error', getErrorMessage(err));
              }
            }}
          >
            {active ? 'Deactivate' : 'Activate'}
          </Button>
        );
      }}
    />
  );
}
