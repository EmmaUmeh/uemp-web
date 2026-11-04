import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react';

interface FieldProps {
  label: string;
  error?: string;
}

const base =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-gray-100';

export const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, ...rest }, ref) => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input ref={ref} className={base} {...rest} />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
);

export interface Option {
  value: string;
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: Option[] }>(
  ({ label, error, options, ...rest }, ref) => (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <select ref={ref} className={base} {...rest}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
);

export default Input;
