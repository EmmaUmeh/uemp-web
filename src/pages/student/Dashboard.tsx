import DataView from '../../components/common/DataView';
import { dashboardService } from '../../api/services/dashboard.service';

export default function Dashboard() {
  return <DataView title="Student dashboard" fetcher={() => dashboardService.getDashboard('student')} />;
}
