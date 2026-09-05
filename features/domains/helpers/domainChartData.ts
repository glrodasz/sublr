import { convertedAmount } from "../../../helpers/aggregations";
import type { MoneyContext, MoneyFields } from "../../../helpers/aggregations";

export interface DomainChartPoint {
  label: string;
  amount: number;
  name: string;
}

interface ChartInput extends MoneyFields {
  occurredAt: unknown;
  name: string;
}

/**
 * Maps one domain's transactions to per-transaction chart points (the mockup
 * tooltip shows amount, date and the source's name), with every amount
 * converted into the reporting currency.
 *
 * `occurredAt` arrives as a Firestore Timestamp from live queries but as an ISO
 * string from anything serialised, so both are accepted.
 */
export function toDomainChartData(
  transactions: ChartInput[],
  ctx: MoneyContext
): DomainChartPoint[] {
  const format = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });

  return transactions.map((t) => {
    const ts = t.occurredAt as { toDate?: () => Date };
    const date = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts as unknown as string);
    return {
      label: format.format(date),
      amount: convertedAmount(t, ctx),
      name: t.name,
    };
  });
}
