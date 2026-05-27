import Link from "next/link";

interface CategoryRow {
  categoryId: string;
  name: string;
  amount: number;
  percent: number;
}

interface Props {
  rows: CategoryRow[];
  currency: string;
}

export function ExpenseBreakdown({ rows, currency }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Expenses</span>
        <Link href="/expenses" className="view-all">
          View all
        </Link>
      </div>

      {rows.length === 0 ? (
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

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--fg-0, #f0f0f5);
        }

        .view-all {
          font-size: 0.78rem;
          color: var(--fg-2, #7a7a9a);
          text-decoration: none;
        }

        .view-all:hover {
          color: var(--fg-1, #b8b8c8);
        }

        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2, #7a7a9a);
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
          color: var(--fg-1, #b8b8c8);
        }

        .row-pct {
          font-size: 0.75rem;
          color: var(--fg-2, #7a7a9a);
        }

        .bar-track {
          height: 4px;
          background: var(--bg-2, #1e1e2e);
          border-radius: 2px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: var(--accent, #7cffb2);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}
