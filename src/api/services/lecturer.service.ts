import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrapList } from '../unwrap';
import { createResource } from './resource';
import { normalizeUserRow, toUserPayload } from './user.service';
import type { ClassStudent, Course, Row } from '../../types';

const users = createResource<Row>(ENDPOINTS.lecturers);

export const lecturerService = {
  ...users,
  async list(params?: Record<string, unknown>): Promise<Row[]> {
    return (await users.list(params))
      .filter((user) => user.role === 'lecturer')
      .map(normalizeUserRow);
  },
  async create(payload: Record<string, unknown>): Promise<Row> {
    return normalizeUserRow(await users.create(toUserPayload(payload, 'lecturer')));
  },
  async update(id: string, payload: Record<string, unknown>): Promise<Row> {
    return normalizeUserRow(await users.update(id, toUserPayload(payload, 'lecturer')));
  },
  async getAssignedCourses(): Promise<Course[]> {
    return createResource<Course>(ENDPOINTS.lecturerCourses).list();
  },
  async getClassList(courseId: string): Promise<ClassStudent[]> {
    const registrations = unwrapList<Record<string, unknown>>((await client.get(ENDPOINTS.registrations)).data);
    return registrations
      .filter((registration) => {
        const course = registration.course;
        const registeredCourseId =
          typeof course === 'object' && course !== null
            ? String((course as Record<string, unknown>).id ?? (course as Record<string, unknown>)._id ?? '')
            : String(registration.courseId ?? '');
        return registeredCourseId === courseId;
      })
      .map((registration) => {
        const student =
          typeof registration.student === 'object' && registration.student !== null
            ? (registration.student as Record<string, unknown>)
            : registration;
        const id = String(student.id ?? student._id ?? registration.studentId ?? '');
        return {
          id,
          name: String(student.name ?? [student.firstName, student.lastName].filter(Boolean).join(' ')),
          matricNumber: String(student.matricNumber ?? student.studentNumber ?? ''),
          ...(typeof student.level === 'number' ? { level: student.level } : {}),
        };
      });
  },
};
