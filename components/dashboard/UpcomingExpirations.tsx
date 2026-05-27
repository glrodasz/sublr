import type { RecurringItem } from "../../types";

interface Props {
  items: RecurringItem[];
}

function formatDate(ts: RecurringItem["nextOccurrence"]): string {
  if (!ts) return "—";
  const date =
    typeof (ts as { toDate?: () => Date }).toDate === "function"
      ? (ts as { toDate: () => Date }).toDate()
      : new Date(ts as unknown as string);

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export function UpcomingExpirations({ items }: Props) {
  return (
    <div className="card">
      <span className="card-title">Next to expire</span>

      {items.length === 0 ? (
        <p className="empty">No upcoming items</p>
      ) : (
        <ul className="list">
          {items.map((item) => (
            <li key={item.id} className="item">
              <span className="item-name">{item.name}</span>
              <span className="item-right">
                <span className="item-amount">
                  {item.currency} {item.amount.toFixed(2)}
                </span>
                <span className="item-date">{formatDate(item.nextOccurrence)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .card {
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line, #2a2a38);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--fg-0, #f0f0f5);
        }

        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2, #7a7a9a);
        }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .item-name {
          font-size: 0.85rem;
          color: var(--fg-1, #b8b8c8);
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
          gap: 1px;
        }

        .item-amount {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--fg-0, #f0f0f5);
        }

        .item-date {
          font-size: 0.72rem;
          color: var(--fg-2, #7a7a9a);
        }
      `}</style>
    </div>
  );
}
