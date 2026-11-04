import DataView from '../../components/common/DataView';
import { dashboardService } from '../../api/services/dashboard.service';

export default function Dashboard() {
  return <DataView title="University dashboard" fetcher={() => dashboardService.getDashboard('super_admin')} />;
}
