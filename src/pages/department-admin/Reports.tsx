import DataView from '../../components/common/DataView';
import { dashboardService } from '../../api/services/dashboard.service';

export default function Reports() {
  return <DataView title="Department reports" fetcher={() => dashboardService.getReport('department_admin')} />;
}
