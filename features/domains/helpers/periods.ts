export const PERIODS = [
  { label: "Current", months: 0 },
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
] as const;

/**
 * Start of the window to query transactions for.
 *
 * `months: 0` means "current month", so it snaps to the 1st rather than
 * counting back a period.
 */
export function getStartDate(months: number, now: Date = new Date()): Date {
  if (months === 0) return new Date(now.getFullYear(), now.getMonth(), 1);
  const d = new Date(now);
  d.setMonth(d.getMonth() - months);
  return d;
}
