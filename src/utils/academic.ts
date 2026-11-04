import { PASS_MARK } from './constants';
import type { CourseResultRow, Result } from '../types';

export function totalUnits(items: { creditUnits: number }[]): number {
  return items.reduce((sum, item) => sum + item.creditUnits, 0);
}

export function computeGpa(results: Result[]): number | null {
  const units = totalUnits(results);
  if (!units) return null;
  const points = results.reduce((sum, r) => sum + r.gradePoint * r.creditUnits, 0);
  return Math.round((points / units) * 100) / 100;
}

export function courseStats(rows: CourseResultRow[]) {
  const totals = rows
    .filter((r) => r.ca !== null || r.exam !== null)
    .map((r) => (r.ca ?? 0) + (r.exam ?? 0));
  if (!totals.length) return null;
  const passed = totals.filter((t) => t >= PASS_MARK).length;
  return {
    average: Math.round((totals.reduce((a, b) => a + b, 0) / totals.length) * 10) / 10,
    highest: Math.max(...totals),
    lowest: Math.min(...totals),
    passRate: Math.round((passed / totals.length) * 100),
  };
}
