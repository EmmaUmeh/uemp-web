const styles: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  active: 'bg-green-100 text-green-700',
  submitted: 'bg-blue-100 text-blue-700',
  draft: 'bg-gray-100 text-gray-700',
  rejected: 'bg-red-100 text-red-700',
  inactive: 'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: { status: string }) {
  const style = styles[status.toLowerCase()] ?? 'bg-gray-100 text-gray-700';
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>{status}</span>;
}
