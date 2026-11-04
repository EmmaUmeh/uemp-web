import DataView from '../../components/common/DataView';
import { studentService } from '../../api/services/student.service';

export default function Profile() {
  return <DataView title="Profile" fetcher={() => studentService.getProfile()} />;
}
