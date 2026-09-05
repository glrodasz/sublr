import type { RecurringItem, Transaction } from "../types";

const FREQ_TO_MONTHS: Record<RecurringItem["frequency"], number> = {
  ONE_TIME: 0,
  WEEKLY: 4.345,
  BIWEEKLY: 2.1725,
  MONTHLY: 1,
  QUARTERLY: 1 / 3,
  YEARLY: 1 / 12,
};

export function toMonthlyAmount(item: RecurringItem): number {
  return item.amount * FREQ_TO_MONTHS[item.frequency];
}

export function sumMonthly(items: RecurringItem[]): number {
  return items.reduce((acc, i) => acc + toMonthlyAmount(i), 0);
}

export function groupByCategory(items: RecurringItem[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, i) => {
    acc[i.categoryId] = (acc[i.categoryId] ?? 0) + toMonthlyAmount(i);
    return acc;
  }, {});
}

export function computeMoM(
  transactions: Transaction[]
): { current: number; previous: number; deltaPct: number } {
  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth();
  const py = cm === 0 ? cy - 1 : cy;
  const pm = cm === 0 ? 11 : cm - 1;

  let current = 0;
  let previous = 0;

  for (const t of transactions) {
    const d =
      typeof (t.occurredAt as { toDate?: () => Date }).toDate === "function"
        ? (t.occurredAt as { toDate: () => Date }).toDate()
        : new Date(t.occurredAt as unknown as string);

    if (d.getFullYear() === cy && d.getMonth() === cm) current += t.amount;
    else if (d.getFullYear() === py && d.getMonth() === pm) previous += t.amount;
  }

  const deltaPct = previous === 0 ? 0 : ((current - previous) / previous) * 100;
  return { current, previous, deltaPct };
}
