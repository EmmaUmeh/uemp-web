import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import CoursePicker from '../../components/common/CoursePicker';
import PageHeader from '../../components/common/PageHeader';
import QueryBoundary from '../../components/common/QueryBoundary';
import StatGrid from '../../components/common/StatGrid';
import StatusBadge from '../../components/common/StatusBadge';
import { resultService } from '../../api/services/result.service';
import { useFetch } from '../../hooks/useFetch';
import { courseStats } from '../../utils/academic';
import { getErrorMessage } from '../../utils/formatters';
import type { CourseResultRow, ResultScoreInput } from '../../types';

type Scores = Record<string, { ca: string; exam: string }>;

const editable = (row: CourseResultRow) => !row.status || row.status === 'draft' || row.status === 'rejected';

function CourseResults({ courseId }: { courseId: string }) {
  const { data, loading, error, reload } = useFetch(() => resultService.getCourseResults(courseId), [courseId]);
  const [scores, setScores] = useState<Scores>({});
  const [busy, setBusy] = useState<'draft' | 'submit' | null>(null);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    const initial: Scores = {};
    (data ?? []).forEach((r) => {
      initial[r.studentId] = { ca: r.ca?.toString() ?? '', exam: r.exam?.toString() ?? '' };
    });
    setScores(initial);
  }, [data]);

  const rows = data ?? [];
  const locked = rows.length > 0 && rows.every((r) => !editable(r));
  const stats = courseStats(rows);
  const feedback = rows.find((r) => r.status === 'rejected' && r.feedback)?.feedback;

  const change = (id: string, field: 'ca' | 'exam', value: string) =>
    setScores((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const toInput = (): ResultScoreInput[] =>
    rows
      .filter(editable)
      .map((r) => ({
        studentId: r.studentId,
        registrationId: r.registrationId,
        resultId: r.resultId,
        ca: Number(scores[r.studentId]?.ca || 0),
        exam: Number(scores[r.studentId]?.exam || 0),
      }));

  const run = async (kind: 'draft' | 'submit') => {
    setBusy(kind);
    setNotice(null);
    try {
      if (kind === 'draft') await resultService.saveDraftResults(courseId, toInput());
      else await resultService.submitResults(courseId, toInput());
      setNotice({ type: 'success', message: kind === 'draft' ? 'Draft saved.' : 'Results submitted for approval.' });
      reload();
    } catch (err) {
      setNotice({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setBusy(null);
    }
  };

  return (
    <QueryBoundary loading={loading} error={error} onRetry={reload}>
      <Alert type={notice?.type ?? 'success'} message={notice?.message ?? null} />
      {feedback && <Alert type="error" message={`Returned for correction: ${feedback}`} />}
      {stats && (
        <div className="mb-6">
          <StatGrid data={{ average: stats.average, highest: stats.highest, lowest: stats.lowest, passRate: `${stats.passRate}%` }} />
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Matric number</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">CA</th>
              <th className="px-4 py-3 font-medium">Exam</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.studentId}>
                <td className="px-4 py-3">{r.matricNumber}</td>
                <td className="px-4 py-3">{r.name}</td>
                {(['ca', 'exam'] as const).map((field) => (
                  <td key={field} className="px-4 py-3">
                    {editable(r) ? (
                      <input
                        type="number"
                        min={0}
                        value={scores[r.studentId]?.[field] ?? ''}
                        onChange={(e) => change(r.studentId, field, e.target.value)}
                        className="w-20 rounded-md border border-gray-300 px-2 py-1"
                      />
                    ) : (
                      r[field] ?? '-'
                    )}
                  </td>
                ))}
                <td className="px-4 py-3">{r.status ? <StatusBadge status={r.status} /> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!locked && rows.length > 0 && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" loading={busy === 'draft'} disabled={busy !== null} onClick={() => run('draft')}>
            Save draft
          </Button>
          <Button loading={busy === 'submit'} disabled={busy !== null} onClick={() => run('submit')}>
            Submit for approval
          </Button>
        </div>
      )}
    </QueryBoundary>
  );
}

export default function ManageResults() {
  const { courseId } = useParams();
  return (
    <>
      <PageHeader title="Manage results" />
      <CoursePicker basePath="/lecturer/results" value={courseId} />
      {courseId && <CourseResults courseId={courseId} />}
    </>
  );
}
