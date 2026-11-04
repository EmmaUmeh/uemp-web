import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-white text-navy-900 border border-gray-300 hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export default function Button({ variant = 'primary', loading, disabled, children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
