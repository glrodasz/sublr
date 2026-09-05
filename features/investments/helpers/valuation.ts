import { convertedAmount } from "../../../helpers/aggregations";
import type { MoneyContext } from "../../../helpers/aggregations";
import { convert } from "../../../helpers/fx";
import type { FlowPoint } from "../../../helpers/chartData";
import type { InvestmentValuation, Transaction } from "../../../types";

/** Value implied by a gain: 0% leaves the basis alone, +100% doubles it. */
export function valueFromGain(costBasis: number, gainPct: number): number {
  return costBasis * (1 + gainPct / 100);
}

/** Gain implied by a value; null when there's no basis to compare against. */
export function gainFromValue(costBasis: number, value: number): number | null {
  if (costBasis <= 0) return null;
  return ((value - costBasis) / costBasis) * 100;
}

function occurred(t: Transaction): Date {
  return t.occurredAt.toDate();
}

/**
 * Everything paid into one investment category up to `asOf`, converted into
 * the reporting currency. Only PAID transactions count — a skipped or pending
 * contribution never left the account.
 */
export function costBasisAt(
  transactions: Transaction[],
  categoryId: string,
  asOf: Date,
  ctx: MoneyContext
): number {
  return transactions
    .filter(
      (t) =>
        t.domain === "INVESTMENT" &&
        t.categoryId === categoryId &&
        t.status === "PAID" &&
        occurred(t) <= asOf
    )
    .reduce((sum, t) => sum + convertedAmount(t, ctx), 0);
}

/** The most recent valuation at or before `asOf`, or null. */
export function latestValuationAt(
  valuations: InvestmentValuation[],
  asOf: Date
): InvestmentValuation | null {
  let best: InvestmentValuation | null = null;
  for (const v of valuations) {
    const at = v.asOf.toDate();
    if (at <= asOf && (!best || at > best.asOf.toDate())) best = v;
  }
  return best;
}

const MONTH_LABEL = new Intl.DateTimeFormat("en", { month: "short" });

/**
 * Invested vs value, one point per month for the last `months` months, for
 * FlowChart (`income` = invested, `expense` = value — the caller relabels).
 * Value carries the latest valuation forward; before any valuation exists it
 * simply equals the basis, so the two lines start together and split where
 * the user first told us what the position was really worth.
 */
export function valuationSeries(
  transactions: Transaction[],
  valuations: InvestmentValuation[],
  categoryId: string,
  ctx: MoneyContext,
  months: number,
  now: Date = new Date()
): FlowPoint[] {
  const points: FlowPoint[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = i === 0 ? now : new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59);
    const invested = costBasisAt(transactions, categoryId, monthEnd, ctx);
    const latest = latestValuationAt(valuations, monthEnd);
    const value = latest ? convert(latest.value, latest.currency, ctx.target, ctx.rates) : invested;
    points.push({ label: MONTH_LABEL.format(monthStart), income: invested, expense: value });
  }
  return points;
}
