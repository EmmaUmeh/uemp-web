import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../unwrap';
import { createResource } from './resource';
import { normalizeUserRow, toUserPayload } from './user.service';
import type { DashboardData, Row } from '../../types';

const users = createResource<Row>(ENDPOINTS.students);

export const studentService = {
  ...users,
  async list(params?: Record<string, unknown>): Promise<Row[]> {
    return (await users.list(params)).filter((user) => user.role === 'student').map(normalizeUserRow);
  },
  async create(payload: Record<string, unknown>): Promise<Row> {
    return normalizeUserRow(await users.create(toUserPayload(payload, 'student')));
  },
  async update(id: string, payload: Record<string, unknown>): Promise<Row> {
    return normalizeUserRow(await users.update(id, toUserPayload(payload, 'student')));
  },
  async getProfile(): Promise<DashboardData> {
    const response = unwrap<unknown>((await client.get(ENDPOINTS.studentProfile)).data);
    const user =
      typeof response === 'object' && response !== null && 'user' in response
        ? response.user
        : response;
    if (typeof user !== 'object' || user === null) {
      throw new Error('The server returned an invalid user profile.');
    }
    const profile = user as Record<string, unknown>;
    const name =
      typeof profile.name === 'string'
        ? profile.name
        : [profile.firstName, profile.lastName].filter((part) => typeof part === 'string').join(' ');
    const department =
      typeof profile.departmentName === 'string'
        ? profile.departmentName
        : typeof profile.department === 'string'
          ? profile.department
          : '';
    return {
      name: String(name),
      email: typeof profile.emailAddress === 'string' ? profile.emailAddress : typeof profile.email === 'string' ? profile.email : '',
      role: typeof profile.role === 'string' ? profile.role : '',
      matricNumber: typeof profile.matricNumber === 'string' ? profile.matricNumber : typeof profile.studentNumber === 'string' ? profile.studentNumber : '',
      level: typeof profile.level === 'number' || typeof profile.level === 'string' ? profile.level : '',
      department,
    };
  },
};
