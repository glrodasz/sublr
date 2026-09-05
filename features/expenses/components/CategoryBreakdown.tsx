import { Card } from "../../../components/atoms/Card";
import { formatAmount } from "../../../components/atoms/Amount";
import { FREQUENCY_LABELS } from "../../../constants";
import type { Category, Currency, RecurrentTransaction } from "../../../types";

interface Props {
  categories: Category[];
  items: RecurrentTransaction[];
  selectedCategoryId: string | null;
  categoryTotal: number;
  currency: Currency;
  loading: boolean;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryBreakdown({
  categories,
  items,
  selectedCategoryId,
  categoryTotal,
  currency,
  loading,
  onSelectCategory,
}: Props) {
  const selected = categories.find((c) => c.id === selectedCategoryId);

  return (
    <Card>
      <div className="cat-header">
        <span className="cat-title">Categories</span>
        <button type="button" className="filter-btn" disabled aria-label="Filter">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
        </button>
      </div>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="empty">No categories yet</p>
      ) : (
        <>
          <div className="cat-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-tab${cat.id === selectedCategoryId ? " active" : ""}`}
                onClick={() => onSelectCategory(cat.id ?? null)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {selected && (
            <p className="cat-total">
              Expenses by {selected.name}: <strong>{formatAmount(categoryTotal, currency)}</strong>
            </p>
          )}

          {items.length === 0 ? (
            <p className="empty">No items in this category</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Frequency</th>
                  <th>Payment method</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="mono">{formatAmount(item.amount, item.currency)}</td>
                    <td className="muted">{FREQUENCY_LABELS[item.frequency]}</td>
                    <td className="muted">—</td>
                    <td className="actions">
                      <button type="button" className="more-btn" disabled aria-label="More options">
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <style jsx>{`
        .cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cat-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--fg-0);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--fg-2);
          cursor: pointer;
          border-radius: var(--r-sm);
          transition:
            background 0.15s,
            color 0.15s;
        }

        .filter-btn:hover:not(:disabled) {
          background: var(--bg-2);
          color: var(--fg-1);
        }

        .filter-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cat-tabs {
          display: flex;
          border-bottom: 1px solid var(--line);
          margin-bottom: 16px;
          gap: 0;
        }

        .cat-tab {
          padding: 8px 16px 9px;
          border: none;
          background: transparent;
          color: var(--fg-2);
          font-size: 0.85rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition:
            color 0.15s,
            border-color 0.15s;
          white-space: nowrap;
        }

        .cat-tab.active {
          color: var(--fg-0);
          border-bottom-color: var(--domain-expense);
        }

        .cat-tab:first-child {
          padding-left: 0;
        }

        .cat-total {
          margin: 0 0 16px;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        .cat-total strong {
          color: var(--fg-0);
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .table th {
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg-2);
          padding: 0 12px 10px 0;
          border-bottom: 1px solid var(--line);
          white-space: nowrap;
        }

        .table th:last-child {
          padding-right: 0;
        }

        .table td {
          padding: 12px 12px 12px 0;
          color: var(--fg-1);
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }

        .table td:last-child {
          padding-right: 0;
        }

        .table tr:last-child td {
          border-bottom: none;
        }

        .mono {
          font-family: var(--font-mono, "JetBrains Mono", ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
          color: var(--fg-0);
          font-weight: 600;
          white-space: nowrap;
        }

        .muted {
          color: var(--fg-2);
        }

        .actions {
          text-align: right;
          width: 32px;
        }

        .more-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: var(--fg-2);
          font-size: 1.1rem;
          cursor: pointer;
          border-radius: var(--r-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition:
            background 0.15s,
            color 0.15s;
        }

        .more-btn:hover:not(:disabled) {
          background: var(--bg-2);
          color: var(--fg-1);
        }

        .more-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        @media (max-width: 600px) {
          .table th:nth-child(4),
          .table td:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </Card>
  );
}
