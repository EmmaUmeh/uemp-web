import DataView from '../../components/common/DataView';
import { dashboardService } from '../../api/services/dashboard.service';

export default function Dashboard() {
  return <DataView title="Department dashboard" fetcher={() => dashboardService.getDashboard('department_admin')} />;
}
