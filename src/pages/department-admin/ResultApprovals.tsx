import { useState } from 'react';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import DataTable, { type Column } from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import StatusBadge from '../../components/common/StatusBadge';
import { resultService } from '../../api/services/result.service';
import { useFetch } from '../../hooks/useFetch';
import { formatDate, getErrorMessage } from '../../utils/formatters';
import type { ResultSubmission } from '../../types';

export default function ResultApprovals() {
  const { data, loading, error, reload } = useFetch(() => resultService.getSubmissions());
  const [rejecting, setRejecting] = useState<ResultSubmission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const act = async (id: string, action: () => Promise<void>, success: string) => {
    setBusyId(id);
    setNotice(null);
    try {
      await action();
      setNotice({ type: 'success', message: success });
      setRejecting(null);
      setFeedback('');
      reload();
    } catch (err) {
      setNotice({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  const columns: Column<ResultSubmission>[] = [
    { key: 'courseCode', header: 'Code' },
    { key: 'courseTitle', header: 'Title' },
    { key: 'lecturerName', header: 'Lecturer' },
    { key: 'submittedAt', header: 'Submitted', render: (s) => formatDate(s.submittedAt) },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: (s) =>
        s.status === 'submitted' ? (
          <div className="flex gap-2">
            <Button loading={busyId === s.id} onClick={() => act(s.id, () => resultService.approveResults(s.id), 'Results approved.')}>
              Approve
            </Button>
            <Button variant="secondary" disabled={busyId === s.id} onClick={() => setRejecting(s)}>
              Return
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader title="Result approvals" />
      <Alert type={notice?.type ?? 'success'} message={notice?.message ?? null} />
      <QueryBoundary loading={loading} error={error} onRetry={reload}>
        <DataTable columns={columns} rows={data ?? []} />
      </QueryBoundary>
      <Modal open={Boolean(rejecting)} title="Return results for correction" onClose={() => setRejecting(null)}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder="Tell the lecturer what needs to change"
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setRejecting(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!feedback.trim()}
            loading={busyId === rejecting?.id}
            onClick={() => rejecting && act(rejecting.id, () => resultService.rejectResults(rejecting.id, feedback.trim()), 'Results returned to lecturer.')}
          >
            Return results
          </Button>
        </div>
      </Modal>
    </>
  );
}
