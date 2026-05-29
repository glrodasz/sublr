import { Card } from "../atoms/Card";
import { SectionTitle } from "../atoms/SectionTitle";

interface CategoryRow {
  categoryId: string;
  name: string;
  amount: number;
  percent: number;
}

interface Props {
  rows: CategoryRow[];
  currency: string;
  loading?: boolean;
}

export function ExpenseBreakdown({ rows, loading }: Props) {
  return (
    <Card accentColor="var(--domain-expense)">
      <SectionTitle title="Expenses" href="/expenses" />

      {loading ? (
        <p className="empty">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="empty">No data yet</p>
      ) : (
        <ul className="rows">
          {rows.map((row) => (
            <li key={row.categoryId} className="row">
              <div className="row-meta">
                <span className="row-name">{row.name}</span>
                <span className="row-pct">{row.percent.toFixed(0)}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${row.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        .rows {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .row-meta {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .row-name {
          font-size: 0.83rem;
          color: var(--fg-1);
        }

        .row-pct {
          font-size: 0.75rem;
          color: var(--fg-2);
        }

        .bar-track {
          height: 4px;
          background: var(--bg-2);
          border-radius: 2px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: var(--domain-expense);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      `}</style>
    </Card>
  );
}
