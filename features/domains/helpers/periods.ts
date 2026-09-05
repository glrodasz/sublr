export const PERIODS = [
  { label: "Current", months: 0 },
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
] as const;

/**
 * Opens on the rolling 1-month window rather than "Current": on the 1st of a
 * month, month-to-date is legitimately near-empty and reads as a broken filter.
 */
export const DEFAULT_PERIOD_INDEX = 1;

/**
 * Start of the window to query transactions for, at midnight so the first day
 * is included whole.
 *
 * `months: 0` means "current month", so it snaps to the 1st rather than
 * counting back a period. Other windows count back whole months, clamping the
 * day to the target month's length — plain `setMonth(-1)` on the 31st would
 * overflow into the wrong month (May 31 → April 31 → May 1).
 */
export function getStartDate(months: number, now: Date = new Date()): Date {
  if (months === 0) return new Date(now.getFullYear(), now.getMonth(), 1);

  const year = now.getFullYear();
  const month = now.getMonth() - months;
  const lastDayOfTarget = new Date(year, month + 1, 0).getDate();

  return new Date(year, month, Math.min(now.getDate(), lastDayOfTarget));
}
