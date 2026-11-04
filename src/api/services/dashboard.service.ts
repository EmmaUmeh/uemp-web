import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../unwrap';
import type { DashboardData, Role } from '../../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getCollection(body: unknown, key: string): unknown[] {
  const payload = unwrap<unknown>(body);
  if (Array.isArray(payload)) return payload;
  if (isRecord(payload)) {
    if (Array.isArray(payload[key])) return payload[key];
    if (Array.isArray(payload.items)) return payload.items;
  }
  throw new Error(`The server returned an invalid ${key} list.`);
}

function countStatus(records: unknown[], status: string): number {
  return records.filter((record) => isRecord(record) && record.status === status).length;
}

export const dashboardService = {
  async getDashboard(role: Role): Promise<DashboardData> {
    if (role === 'student' || role === 'lecturer') {
      const [registrationsResponse, resultsResponse] = await Promise.all([
        client.get(ENDPOINTS.registrations),
        client.get(ENDPOINTS.results),
      ]);
      const registrations = getCollection(registrationsResponse.data, 'registrations');
      const results = getCollection(resultsResponse.data, 'results');

      return {
        courseRegistrations: registrations.length,
        results: results.length,
        draftResults: countStatus(results, 'draft'),
        submittedResults: countStatus(results, 'submitted'),
      };
    }

    const requests = [
      client.get(ENDPOINTS.users),
      client.get(ENDPOINTS.courses),
      client.get(ENDPOINTS.registrations),
      client.get(ENDPOINTS.results),
      ...(role === 'super_admin' ? [client.get(ENDPOINTS.activities)] : []),
    ];
    const [usersResponse, coursesResponse, registrationsResponse, resultsResponse, activitiesResponse] =
      await Promise.all(requests);

    return {
      users: getCollection(usersResponse.data, 'users').length,
      courses: getCollection(coursesResponse.data, 'courses').length,
      registrations: getCollection(registrationsResponse.data, 'registrations').length,
      results: getCollection(resultsResponse.data, 'results').length,
      ...(activitiesResponse ? { activities: getCollection(activitiesResponse.data, 'activities').length } : {}),
    };
  },
  async getReport(role: 'department_admin' | 'super_admin'): Promise<DashboardData> {
    return this.getDashboard(role);
  },
};
