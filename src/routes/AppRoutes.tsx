import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import { ROLE_HOME } from '../utils/constants';
import Login from '../pages/auth/Login';
import StudentDashboard from '../pages/student/Dashboard';
import AvailableCourses from '../pages/student/AvailableCourses';
import RegisteredCourses from '../pages/student/RegisteredCourses';
import StudentResults from '../pages/student/Results';
import StudentProfile from '../pages/student/Profile';
import LecturerDashboard from '../pages/lecturer/Dashboard';
import MyCourses from '../pages/lecturer/MyCourses';
import ClassList from '../pages/lecturer/ClassList';
import ManageResults from '../pages/lecturer/ManageResults';
import DeptDashboard from '../pages/department-admin/Dashboard';
import DeptStudents from '../pages/department-admin/Students';
import DeptLecturers from '../pages/department-admin/Lecturers';
import DeptCourses from '../pages/department-admin/Courses';
import CourseAssignments from '../pages/department-admin/CourseAssignments';
import ResultApprovals from '../pages/department-admin/ResultApprovals';
import DeptReports from '../pages/department-admin/Reports';
import SuperDashboard from '../pages/super-admin/Dashboard';
import Faculties from '../pages/super-admin/Faculties';
import Departments from '../pages/super-admin/Departments';
import Programs from '../pages/super-admin/Programs';
import Users from '../pages/super-admin/Users';
import Periods from '../pages/super-admin/Periods';
import SuperReports from '../pages/super-admin/Reports';

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? ROLE_HOME[user.role] : '/login'} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="available-courses" element={<AvailableCourses />} />
          <Route path="registered-courses" element={<RegisteredCourses />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="lecturer" />}>
        <Route path="/lecturer" element={<DashboardLayout />}>
          <Route index element={<LecturerDashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="class-list/:courseId?" element={<ClassList />} />
          <Route path="results/:courseId?" element={<ManageResults />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="department_admin" />}>
        <Route path="/department-admin" element={<DashboardLayout />}>
          <Route index element={<DeptDashboard />} />
          <Route path="students" element={<DeptStudents />} />
          <Route path="lecturers" element={<DeptLecturers />} />
          <Route path="courses" element={<DeptCourses />} />
          <Route path="assignments" element={<CourseAssignments />} />
          <Route path="approvals" element={<ResultApprovals />} />
          <Route path="reports" element={<DeptReports />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="super_admin" />}>
        <Route path="/super-admin" element={<DashboardLayout />}>
          <Route index element={<SuperDashboard />} />
          <Route path="faculties" element={<Faculties />} />
          <Route path="departments" element={<Departments />} />
          <Route path="programs" element={<Programs />} />
          <Route path="courses" element={<DeptCourses />} />
          <Route path="users" element={<Users />} />
          <Route path="periods" element={<Periods />} />
          <Route path="sessions" element={<Navigate to="/super-admin/periods" replace />} />
          <Route path="semesters" element={<Navigate to="/super-admin/periods" replace />} />
          <Route path="reports" element={<SuperReports />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
