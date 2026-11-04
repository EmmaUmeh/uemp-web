import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_HOME } from '../../utils/constants';
import { getErrorMessage } from '../../utils/formatters';
import type { LoginCredentials } from '../../types';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<LoginCredentials>();

  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />;

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const current = await login(values);
      navigate(ROLE_HOME[current.role], { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-8">
        <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
          <GraduationCap className="h-6 w-6 text-accent" />
          University Education Management Portal
        </div>
        <Alert type="error" message={error} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={formState.errors.emailAddress?.message}
          {...register('emailAddress', { required: 'Email is required' })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={formState.errors.password?.message}
          {...register('password', { required: 'Password is required' })}
        />
        <Button type="submit" loading={formState.isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
