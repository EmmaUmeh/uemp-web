import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../unwrap';
import type { LoginCredentials, Role, User } from '../../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function isRole(value: unknown): value is Role {
  return value === 'student' || value === 'lecturer' || value === 'department_admin' || value === 'super_admin';
}

function normalizeUser(response: unknown): User {
  const payload = unwrap<unknown>(response);
  const user = isRecord(payload) && isRecord(payload.user) ? payload.user : payload;
  if (!isRecord(user) || !isRole(user.role)) {
    throw new Error('The server returned an invalid user session.');
  }

  const id = getString(user.id) ?? getString(user._id);
  const name =
    getString(user.name) ??
    [getString(user.firstName), getString(user.lastName)].filter(Boolean).join(' ');
  const email = getString(user.email) ?? getString(user.emailAddress);
  if (!id || !name || !email) {
    throw new Error('The server returned incomplete user details.');
  }

  return {
    id,
    name,
    email,
    role: user.role,
    ...(typeof user.isActive === 'boolean' ? { isActive: user.isActive } : {}),
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<void> {
    await client.post(ENDPOINTS.auth.login, credentials);
  },

  async logout(): Promise<void> {
    await client.post(ENDPOINTS.auth.logout);
  },

  async getCurrentUser(): Promise<User> {
    return normalizeUser((await client.get(ENDPOINTS.auth.me)).data);
  },
};
