import type { Transaction } from "../../types";
import { Card } from "../atoms/Card";
import { SectionTitle } from "../atoms/SectionTitle";
import { TransactionRow } from "../molecules/TransactionRow";

interface Props {
  transactions: Transaction[];
  loading?: boolean;
}

function formatDate(ts: Transaction["occurredAt"]): string {
  const date =
    typeof (ts as { toDate?: () => Date }).toDate === "function"
      ? (ts as { toDate: () => Date }).toDate()
      : new Date(ts as unknown as string);

  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-diffDays, "day");
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export function RecentPayments({ transactions, loading }: Props) {
  return (
    <Card>
      <SectionTitle title="Recent payments" />

      {loading ? (
        <p className="empty">Loading…</p>
      ) : transactions.length === 0 ? (
        <p className="empty">No data yet</p>
      ) : (
        <ul className="list">
          {transactions.map((t) => (
            <TransactionRow
              key={t.id}
              name={t.name}
              amount={t.amount}
              currency={t.currency}
              meta={formatDate(t.occurredAt)}
            />
          ))}
        </ul>
      )}

      <style jsx>{`
        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>
    </Card>
  );
}
