import DataView from '../../components/common/DataView';
import { dashboardService } from '../../api/services/dashboard.service';

export default function Dashboard() {
  return <DataView title="Lecturer dashboard" fetcher={() => dashboardService.getDashboard('lecturer')} />;
}
