import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 py-10 text-sm text-red-700">
      <AlertCircle className="h-6 w-6" />
      <p>{message}</p>
      {/* {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )} */}
    </div>
  );
}
