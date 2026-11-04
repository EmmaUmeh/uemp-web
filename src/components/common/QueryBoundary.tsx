import type { ReactNode } from 'react';
import Loading from './Loading';
import ErrorState from './ErrorState';

interface QueryBoundaryProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  children: ReactNode;
}

export default function QueryBoundary({ loading, error, onRetry, children }: QueryBoundaryProps) {
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  return <>{children}</>;
}
