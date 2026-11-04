import type { Role } from '../types';

export const AUTH_EXPIRED_EVENT = 'uemp:auth-expired';
export const PAGE_SIZE = 10;
export const PASS_MARK = 40;

export const ROLE_HOME: Record<Role, string> = {
  student: '/student',
  lecturer: '/lecturer',
  department_admin: '/department-admin',
  super_admin: '/super-admin',
};

export const ROLE_LABEL: Record<Role, string> = {
  student: 'Student',
  lecturer: 'Lecturer',
  department_admin: 'Department Admin',
  super_admin: 'Super Admin',
};
