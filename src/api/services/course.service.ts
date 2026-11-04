import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrapList } from '../unwrap';
import { createResource, normalizeResourceId, type Payload } from './resource';
import type { Course } from '../../types';

const courses = createResource<Course>(ENDPOINTS.courses);

export const courseService = {
  getCourses: courses.list,
  getCourseById: courses.get,
  createCourse: courses.create,
  updateCourse: courses.update,
  deleteCourse: courses.remove,
  resource: courses,
  async getAvailableCourses(params?: Payload): Promise<Course[]> {
    return unwrapList<Course>((await client.get(ENDPOINTS.availableCourses, { params })).data).map(normalizeResourceId);
  },
  async assignLecturer(courseId: string, lecturerId: string): Promise<void> {
    await client.patch(ENDPOINTS.assignLecturer(courseId), { lecturerId });
  },
};
