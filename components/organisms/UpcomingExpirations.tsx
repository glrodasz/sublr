import type { RecurringItem } from "../../types";
import { Card } from "../atoms/Card";
import { SectionTitle } from "../atoms/SectionTitle";
import { TransactionRow } from "../molecules/TransactionRow";

interface Props {
  items: RecurringItem[];
  loading?: boolean;
}

function formatDate(ts: RecurringItem["nextOccurrence"]): string {
  if (!ts) return "—";
  const date =
    typeof (ts as { toDate?: () => Date }).toDate === "function"
      ? (ts as { toDate: () => Date }).toDate()
      : new Date(ts as unknown as string);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export function UpcomingExpirations({ items, loading }: Props) {
  return (
    <Card>
      <SectionTitle title="Next to expire" />

      {loading ? (
        <p className="empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="empty">No upcoming items</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <TransactionRow
              key={item.id}
              name={item.name}
              amount={item.amount}
              currency={item.currency}
              meta={formatDate(item.nextOccurrence)}
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
