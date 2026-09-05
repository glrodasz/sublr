import type { Frequency } from "../types";

/** How far back "backfill my history" reaches. Shared with the materializer. */
export const BACKFILL_MONTHS = 6;

export interface ScheduleChoice {
  frequency: Frequency;
  /** MONTHLY / QUARTERLY / YEARLY: day of month, 1–31. Defaults to the 1st. */
  dayOfMonth?: number;
  /** YEARLY: month, 0–11. Defaults to January. */
  month?: number;
  /** ONE_TIME / WEEKLY / BIWEEKLY: an explicit date (YYYY-MM-DD). Defaults to today. */
  date?: string;
  /**
   * "I've been paying this for a while": anchor the schedule far enough back
   * that the materializer generates BACKFILL_MONTHS of history. For yearly
   * items it means the most recent anniversary already happened.
   */
  backfill?: boolean;
}

/** YYYY-MM-DD for `<input type="date">`, in local time. */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parses YYYY-MM-DD as a local date at noon; falls back to `fallback` when unparsable. */
function parseDateInput(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return fallback;
  return new Date(y, m - 1, d, 12);
}

/** Day clamped to the target month's length, at noon local. */
function localNoon(year: number, month: number, day: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay), 12);
}

/**
 * Turns the user's schedule choice into the `startDate` the API stores. Noon
 * local (not midnight) keeps the UTC date inside the materializer's
 * `{itemId}_{YYYY-MM-DD}` ids equal to the local calendar day everywhere the
 * app is likely to run.
 */
export function anchorStartDate(choice: ScheduleChoice, now: Date = new Date()): Date {
  const today = localNoon(now.getFullYear(), now.getMonth(), now.getDate());
  const day = choice.dayOfMonth ?? 1;

  switch (choice.frequency) {
    case "ONE_TIME":
      return parseDateInput(choice.date, today);

    case "WEEKLY":
    case "BIWEEKLY": {
      const base = parseDateInput(choice.date, today);
      return choice.backfill
        ? localNoon(base.getFullYear(), base.getMonth() - BACKFILL_MONTHS, base.getDate())
        : base;
    }

    case "MONTHLY":
    case "QUARTERLY": {
      const monthsBack = choice.backfill ? BACKFILL_MONTHS : 0;
      return localNoon(now.getFullYear(), now.getMonth() - monthsBack, day);
    }

    case "YEARLY": {
      const month = choice.month ?? 0;
      const thisYear = localNoon(now.getFullYear(), month, day);
      if (!choice.backfill) return thisYear;
      return thisYear <= today ? thisYear : localNoon(now.getFullYear() - 1, month, day);
    }
  }
}

/** The inverse, for edit forms: which choice reproduces this stored startDate. */
export function scheduleChoiceFromStartDate(
  startDate: Date,
  frequency: Frequency
): Omit<ScheduleChoice, "backfill"> {
  return {
    frequency,
    dayOfMonth: startDate.getDate(),
    month: startDate.getMonth(),
    date: toDateInputValue(startDate),
  };
}
