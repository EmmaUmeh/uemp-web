import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLE_HOME } from '../utils/constants';
import type { Role } from '../types';
import Loading from './common/Loading';

export default function ProtectedRoute({ role }: { role: Role }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={ROLE_HOME[user.role]} replace />;
  return <Outlet />;
}
