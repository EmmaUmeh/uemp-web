import Button from './Button';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="mb-6 text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
