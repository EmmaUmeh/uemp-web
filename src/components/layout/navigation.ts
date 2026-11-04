import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '../../types';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const NAV_ITEMS: Record<Role, NavItem[]> = {
  student: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/student/available-courses', label: 'Available courses', icon: BookOpen },
    { to: '/student/registered-courses', label: 'Registered courses', icon: ClipboardList },
    { to: '/student/results', label: 'Results', icon: FileText },
    { to: '/student/profile', label: 'Profile', icon: UserRound },
  ],
  lecturer: [
    { to: '/lecturer', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/lecturer/courses', label: 'My courses', icon: BookOpen },
    { to: '/lecturer/class-list', label: 'Class list', icon: Users },
    { to: '/lecturer/results', label: 'Manage results', icon: FileText },
  ],
  department_admin: [
    { to: '/department-admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/department-admin/students', label: 'Students', icon: GraduationCap },
    { to: '/department-admin/lecturers', label: 'Lecturers', icon: Users },
    { to: '/department-admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/department-admin/assignments', label: 'Course assignments', icon: Layers },
    { to: '/department-admin/approvals', label: 'Result approvals', icon: CheckSquare },
    { to: '/department-admin/reports', label: 'Reports', icon: BarChart3 },
  ],
  super_admin: [
    { to: '/super-admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/super-admin/faculties', label: 'Faculties', icon: Building2 },
    { to: '/super-admin/departments', label: 'Departments', icon: Building2 },
    { to: '/super-admin/programs', label: 'Programs', icon: Layers },
    { to: '/super-admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/super-admin/users', label: 'Users', icon: UserCog },
    { to: '/super-admin/periods', label: 'Academic periods', icon: CalendarDays },
    { to: '/super-admin/reports', label: 'Reports', icon: BarChart3 },
  ],
};
