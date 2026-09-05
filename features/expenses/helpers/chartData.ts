export interface ChartPoint {
  label: string;
  amount: number;
  name: string;
}

interface ChartInput {
  occurredAt: unknown;
  amount: number;
  name: string;
}

/**
 * Maps transactions to the shape the area chart expects.
 *
 * `occurredAt` arrives as a Firestore Timestamp from live queries but as an ISO
 * string from anything serialised, so both are accepted.
 */
export function toChartData(transactions: ChartInput[]): ChartPoint[] {
  const format = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" });

  return transactions.map((t) => {
    const ts = t.occurredAt as { toDate?: () => Date };
    const date = typeof ts?.toDate === "function" ? ts.toDate() : new Date(ts as unknown as string);
    return {
      label: format.format(date),
      amount: t.amount,
      name: t.name,
    };
  });
}
