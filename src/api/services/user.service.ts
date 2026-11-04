import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { createResource, type Payload, type Resource } from './resource';
import type { Row } from '../../types';

const users = createResource<Row>(ENDPOINTS.users);

export function normalizeUserRow(user: Row): Row {
  const name =
    typeof user.name === 'string'
      ? user.name
      : [user.firstName, user.lastName].filter((part) => typeof part === 'string').join(' ');
  return {
    ...user,
    name,
    email: typeof user.email === 'string' ? user.email : user.emailAddress,
    staffId: typeof user.staffId === 'string' ? user.staffId : user.staffNumber,
  };
}

export function toUserPayload(payload: Payload, role?: string): Payload {
  const result = { ...payload };
  const name = typeof result.name === 'string' ? result.name.trim().split(/\s+/) : [];
  delete result.name;
  if (name.length > 0) result.firstName = name.shift();
  if (name.length > 0) result.lastName = name.join(' ');
  if ('email' in result) {
    result.emailAddress = result.email;
    delete result.email;
  }
  if ('staffId' in result) {
    result.staffNumber = result.staffId;
    delete result.staffId;
  }
  if (role) result.role = role;
  return result;
}

function normalized(promise: Promise<Row>): Promise<Row> {
  return promise.then(normalizeUserRow);
}

export const userService: Resource<Row> & {
  setActive(id: string, isActive: boolean): Promise<void>;
} = {
  list: async (params) => (await users.list(params)).map(normalizeUserRow),
  get: async (id) => normalizeUserRow(await users.get(id)),
  create: async (payload) => normalized(users.create(toUserPayload(payload))),
  update: async (id, payload) => normalized(users.update(id, toUserPayload(payload))),
  remove: users.remove,
  async setActive(id: string, isActive: boolean): Promise<void> {
    await client.patch(ENDPOINTS.user(id), { isActive });
  },
};
