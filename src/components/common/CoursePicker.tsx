import { useNavigate } from 'react-router-dom';
import { lecturerService } from '../../api/services/lecturer.service';
import { useFetch } from '../../hooks/useFetch';
import { Select } from './Input';
import QueryBoundary from './QueryBoundary';

interface CoursePickerProps {
  basePath: string;
  value?: string;
}

export default function CoursePicker({ basePath, value }: CoursePickerProps) {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFetch(() => lecturerService.getAssignedCourses());

  return (
    <QueryBoundary loading={loading} error={error} onRetry={reload}>
      <div className="mb-6 max-w-sm">
        <Select
          label="Course"
          value={value ?? ''}
          options={(data ?? []).map((c) => ({ value: c.id, label: `${c.code} - ${c.title}` }))}
          onChange={(e) => e.target.value && navigate(`${basePath}/${e.target.value}`)}
        />
      </div>
    </QueryBoundary>
  );
}
