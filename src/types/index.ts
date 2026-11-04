export type Role = 'student' | 'lecturer' | 'department_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
}

export interface LoginCredentials {
  emailAddress: string;
  password: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  level?: number;
  semester?: string;
  lecturerName?: string;
}

export type ResultStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Result {
  id: string;
  courseId?: string;
  courseCode: string;
  courseTitle: string;
  creditUnits: number;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  gradePoint: number;
  status: ResultStatus;
  session?: string;
  semester?: string;
}

export interface CourseResultRow {
  studentId: string;
  registrationId?: string;
  resultId?: string;
  name: string;
  matricNumber: string;
  ca: number | null;
  exam: number | null;
  total?: number | null;
  grade?: string | null;
  status?: ResultStatus;
  feedback?: string | null;
}

export interface ResultScoreInput {
  studentId: string;
  registrationId?: string;
  resultId?: string;
  ca: number;
  exam: number;
}

export interface ResultSubmission {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerName: string;
  status: ResultStatus;
  submittedAt?: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  matricNumber: string;
  level?: number;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
}

export type DashboardValue = string | number | boolean | null | Record<string, unknown>[] | Record<string, unknown>;
export type DashboardData = Record<string, DashboardValue>;

export type Row = { id: string } & Record<string, unknown>;
