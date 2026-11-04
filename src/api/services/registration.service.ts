import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrap, unwrapList } from '../unwrap';
import type { Course, DashboardData } from '../../types';

function toCourse(registration: Record<string, unknown>): Course {
  const rawCourse =
    typeof registration.course === 'object' && registration.course !== null
      ? (registration.course as Record<string, unknown>)
      : registration;
  return {
    id: String(rawCourse.id ?? rawCourse._id ?? registration.courseId ?? registration._id ?? ''),
    code: String(rawCourse.code ?? rawCourse.courseCode ?? ''),
    title: String(rawCourse.title ?? rawCourse.courseTitle ?? ''),
    creditUnits: Number(rawCourse.creditUnits ?? rawCourse.units ?? 0),
    ...(typeof rawCourse.level === 'number' ? { level: rawCourse.level } : {}),
    ...(typeof rawCourse.semester === 'string' ? { semester: rawCourse.semester } : {}),
  };
}

export const registrationService = {
  async registerCourses(courseIds: string[]): Promise<void> {
    await client.post(ENDPOINTS.registrations, { courseIds });
  },
  async getRegisteredCourses(): Promise<Course[]> {
    return unwrapList<Record<string, unknown>>((await client.get(ENDPOINTS.registrations)).data).map(toCourse);
  },
  async getRegistrationSummary(): Promise<DashboardData> {
    const registrations = unwrapList<Record<string, unknown>>((await client.get(ENDPOINTS.registrations)).data);
    return {
      courseRegistrations: registrations.length,
      creditUnits: registrations.reduce((total, registration) => total + toCourse(registration).creditUnits, 0),
    };
  },
};
