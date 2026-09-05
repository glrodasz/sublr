import { Card } from "../../../components/atoms/Card";
import { formatAmount } from "../../../components/atoms/Amount";
import { FREQUENCY_LABELS } from "../../../constants";
import { DOMAIN_CONFIG } from "../helpers/domainConfig";
import type {
  Category,
  Currency,
  Domain,
  PaymentMethod,
  RecurrentTransaction,
} from "../../../types";

interface Props {
  domain: Domain;
  categories: Category[];
  items: RecurrentTransaction[];
  paymentMethods: PaymentMethod[];
  selectedCategoryId: string | null;
  categoryTotal: number;
  currency: Currency;
  loading: boolean;
  onSelectCategory: (id: string | null) => void;
}

/** "{name} - {last4}" when the method has digits, its plain name otherwise. */
export function paymentMethodLabel(method: PaymentMethod | undefined): string {
  if (!method) return "—";
  return method.last4 ? `${method.name} - ${method.last4}` : method.name;
}

export function DomainCategoryTable({
  domain,
  categories,
  items,
  paymentMethods,
  selectedCategoryId,
  categoryTotal,
  currency,
  loading,
  onSelectCategory,
}: Props) {
  const config = DOMAIN_CONFIG[domain];
  const selected = categories.find((c) => c.id === selectedCategoryId);
  const methodById = new Map(paymentMethods.map((m) => [m.id, m]));

  return (
    <Card>
      <div className="cat-header">
        <span className="cat-title">Categories</span>
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
              {config.title} by {selected.name}:{" "}
              <strong>{formatAmount(categoryTotal, currency)}</strong>
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
                  {config.showPaymentMethod && <th>Payment method</th>}
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="mono">{formatAmount(item.amount, item.currency)}</td>
                    <td className="muted">{FREQUENCY_LABELS[item.frequency]}</td>
                    {config.showPaymentMethod && (
                      <td className="muted">
                        {paymentMethodLabel(
                          item.paymentMethodId ? methodById.get(item.paymentMethodId) : undefined
                        )}
                      </td>
                    )}
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

        .cat-tabs {
          display: flex;
          border-bottom: 1px solid var(--line);
          margin-bottom: 16px;
          gap: 0;
          overflow-x: auto;
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
          border-bottom-color: ${config.accent};
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
