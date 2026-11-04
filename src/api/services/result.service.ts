import client from '../client';
import { ENDPOINTS } from '../endpoints';
import { unwrapList } from '../unwrap';
import type { CourseResultRow, DashboardData, Result, ResultScoreInput, ResultSubmission } from '../../types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function recordsFrom(body: unknown): Record<string, unknown>[] {
  return unwrapList<Record<string, unknown>>(body);
}

function courseIdOf(result: Record<string, unknown>): string {
  const course = result.course;
  if (isRecord(course)) return String(course.id ?? course._id ?? '');
  return String(result.courseId ?? '');
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function numberValue(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

function toResult(result: Record<string, unknown>): Result {
  const course = isRecord(result.course) ? result.course : {};
  return {
    id: stringValue(result.id ?? result._id),
    courseId: courseIdOf(result),
    courseCode: stringValue(course.code ?? result.courseCode),
    courseTitle: stringValue(course.title ?? result.courseTitle),
    creditUnits: numberValue(course.creditUnits ?? result.creditUnits),
    ca: numberValue(result.ca),
    exam: numberValue(result.exam),
    total: numberValue(result.total),
    grade: stringValue(result.grade),
    gradePoint: numberValue(result.gradePoint),
    status: stringValue(result.status, 'draft') as Result['status'],
    ...(typeof result.session === 'string' ? { session: result.session } : {}),
    ...(typeof result.semester === 'string' ? { semester: result.semester } : {}),
  };
}

function toCourseResult(result: Record<string, unknown>): CourseResultRow {
  const student = isRecord(result.student) ? result.student : {};
  const registration = isRecord(result.registration) ? result.registration : {};
  return {
    studentId: String(student.id ?? student._id ?? result.studentId ?? ''),
    registrationId: String(registration.id ?? registration._id ?? result.registrationId ?? ''),
    resultId: String(result.id ?? result._id ?? ''),
    name: String(student.name ?? [student.firstName, student.lastName].filter(Boolean).join(' ')),
    matricNumber: String(student.matricNumber ?? student.studentNumber ?? ''),
    ca: typeof result.ca === 'number' ? result.ca : null,
    exam: typeof result.exam === 'number' ? result.exam : null,
    ...(typeof result.total === 'number' ? { total: result.total } : {}),
    ...(typeof result.grade === 'string' ? { grade: result.grade } : {}),
    ...(typeof result.status === 'string' ? { status: result.status as CourseResultRow['status'] } : {}),
    ...(typeof result.feedback === 'string' ? { feedback: result.feedback } : {}),
  };
}

export const resultService = {
  async getResults(): Promise<Result[]> {
    return recordsFrom((await client.get(ENDPOINTS.results)).data).map(toResult);
  },
  async getAcademicSummary(): Promise<DashboardData> {
    const results = await this.getResults();
    return {
      results: results.length,
      approvedResults: results.filter((result) => result.status === 'approved').length,
      pendingResults: results.filter((result) => result.status === 'submitted').length,
    };
  },
  async getCourseResults(courseId: string): Promise<CourseResultRow[]> {
    const [registrationsResponse, resultsResponse] = await Promise.all([
      client.get(ENDPOINTS.registrations),
      client.get(ENDPOINTS.results),
    ]);
    const results = recordsFrom(resultsResponse.data);
    return recordsFrom(registrationsResponse.data)
      .filter((registration) => {
        const course = isRecord(registration.course) ? registration.course : {};
        return String(course.id ?? course._id ?? registration.courseId ?? '') === courseId;
      })
      .map((registration) => {
        const registrationId = String(registration.id ?? registration._id ?? '');
        const result = results.find((candidate) => {
          const relatedRegistration = isRecord(candidate.registration) ? candidate.registration : {};
          return String(relatedRegistration.id ?? relatedRegistration._id ?? candidate.registrationId ?? '') === registrationId;
        });
        const row = toCourseResult({
          ...registration,
          ...(result ?? {}),
          registration,
          registrationId,
          student: isRecord(registration.student) ? registration.student : result?.student,
        });
        return {
          ...row,
          registrationId,
          ...(result ? { resultId: String(result.id ?? result._id ?? '') } : {}),
          status: typeof result?.status === 'string' ? (result.status as CourseResultRow['status']) : 'draft',
        };
      });
  },
  async saveDraftResults(_courseId: string, scores: ResultScoreInput[]): Promise<void> {
    await Promise.all(
      scores.map((score) => {
        if (!score.registrationId) throw new Error('Cannot save a result without its registration ID.');
        return client.put(ENDPOINTS.saveDraft(score.registrationId), { ca: score.ca, exam: score.exam });
      })
    );
  },
  async submitResults(_courseId: string, scores: ResultScoreInput[]): Promise<void> {
    await Promise.all(
      scores.map((score) => {
        if (!score.resultId) throw new Error('Cannot submit a result without its result ID.');
        return client.post(ENDPOINTS.submitResult(score.resultId));
      })
    );
  },
  async getSubmissions(): Promise<ResultSubmission[]> {
    return recordsFrom((await client.get(ENDPOINTS.results)).data)
      .filter((result) => result.status === 'submitted')
      .map((result) => {
        const course = isRecord(result.course) ? result.course : {};
        const lecturer = isRecord(result.lecturer) ? result.lecturer : {};
        return {
          id: String(result.id ?? result._id ?? ''),
          courseId: courseIdOf(result),
          courseCode: String(course.code ?? result.courseCode ?? ''),
          courseTitle: String(course.title ?? result.courseTitle ?? ''),
          lecturerName: String(lecturer.name ?? [lecturer.firstName, lecturer.lastName].filter(Boolean).join(' ')),
          status: 'submitted',
          ...(typeof result.submittedAt === 'string' ? { submittedAt: result.submittedAt } : {}),
        };
      });
  },
  async approveResults(resultId: string): Promise<void> {
    await client.post(ENDPOINTS.reviewResult(resultId), { status: 'approved' });
  },
  async rejectResults(resultId: string, feedback: string): Promise<void> {
    await client.post(ENDPOINTS.reviewResult(resultId), { status: 'rejected', feedback });
  },
};
