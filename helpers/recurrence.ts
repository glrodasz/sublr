import type { Frequency } from "../types";

const STEP_DAYS: Partial<Record<Frequency, number>> = {
  WEEKLY: 7,
  BIWEEKLY: 14,
};

const STEP_MONTHS: Partial<Record<Frequency, number>> = {
  MONTHLY: 1,
  QUARTERLY: 3,
  YEARLY: 12,
};

/**
 * First occurrence strictly after `from` for a schedule anchored at `startDate`.
 * ONE_TIME has no next occurrence, so it returns null.
 *
 * Month-based frequencies clamp to the last day of the target month, so a
 * schedule anchored on the 31st lands on Feb 28/29 rather than rolling into March.
 */
export function nextOccurrenceFrom(
  startDate: Date,
  frequency: Frequency,
  from: Date = new Date()
): Date | null {
  if (frequency === "ONE_TIME") return null;

  const days = STEP_DAYS[frequency];
  if (days) {
    const stepMs = days * 24 * 60 * 60 * 1000;
    const elapsed = from.getTime() - startDate.getTime();
    if (elapsed < 0) return new Date(startDate);
    const steps = Math.floor(elapsed / stepMs) + 1;
    return new Date(startDate.getTime() + steps * stepMs);
  }

  const months = STEP_MONTHS[frequency];
  if (!months) return null;
  if (from < startDate) return new Date(startDate);

  const anchorDay = startDate.getDate();
  let candidate = addMonthsClamped(startDate, months, anchorDay);
  while (candidate <= from) {
    candidate = addMonthsClamped(candidate, months, anchorDay);
  }
  return candidate;
}

function addMonthsClamped(date: Date, months: number, anchorDay: number): Date {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + months);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(anchorDay, lastDay));
  next.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  return next;
}
