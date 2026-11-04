import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'Nothing to show yet.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-sm text-gray-500">
      <Inbox className="h-8 w-8" />
      {message}
    </div>
  );
}
