import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../api/services/auth.service';
import { AUTH_EXPIRED_EVENT } from '../utils/constants';
import type { LoginCredentials, User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    await authService.login(credentials);
    const current = await authService.getCurrentUser();
    setUser(current);
    return current;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout().catch(() => undefined);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
