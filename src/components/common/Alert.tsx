interface AlertProps {
  type: 'error' | 'success';
  message: string | null;
}

export default function Alert({ type, message }: AlertProps) {
  if (!message) return null;
  const style = type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700';
  return <div className={`mb-4 rounded-md border px-3 py-2 text-sm ${style}`}>{message}</div>;
}
