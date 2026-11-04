import client from '../client';
import { unwrap, unwrapList } from '../unwrap';

export type Payload = Record<string, unknown>;

export interface Resource<T> {
  list: (params?: Payload) => Promise<T[]>;
  get: (id: string) => Promise<T>;
  create: (payload: Payload) => Promise<T>;
  update: (id: string, payload: Payload) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function normalizeResourceId<T>(value: T): T {
  if (typeof value !== 'object' || value === null || !('_id' in value) || 'id' in value) return value;
  const id = value._id;
  if (typeof id !== 'string') return value;
  return { ...value, id } as T;
}

export function createResource<T>(path: string): Resource<T> {
  return {
    list: async (params) => unwrapList<T>((await client.get(path, { params })).data).map(normalizeResourceId),
    get: async (id) => normalizeResourceId(unwrap<T>((await client.get(`${path}/${id}`)).data)),
    create: async (payload) => normalizeResourceId(unwrap<T>((await client.post(path, payload)).data)),
    update: async (id, payload) => normalizeResourceId(unwrap<T>((await client.patch(`${path}/${id}`, payload)).data)),
    remove: async (id) => {
      await client.delete(`${path}/${id}`);
    },
  };
}
