import { Amount } from "../../../components/atoms/Amount";
import { PERIODS } from "../helpers/periods";
import type { Currency } from "../../../types";

interface Props {
  total: number;
  currency: Currency;
  deltaPct: number;
  periodIdx: number;
  onPeriodChange: (index: number) => void;
}

export function ExpensesSummary({ total, currency, deltaPct, periodIdx, onPeriodChange }: Props) {
  const hasDelta = deltaPct !== 0;
  const up = deltaPct > 0;

  return (
    <div className="summary-row">
      <div>
        <span className="summary-label">Total expenses</span>
        <div className="summary-amount">
          <Amount value={total} currency={currency} size="lg" />
          {hasDelta && (
            <span className={`delta-badge ${up ? "up" : "down"}`}>
              {up ? "▲" : "▼"} {Math.abs(deltaPct).toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      <div className="period-tabs">
        {PERIODS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            className={`period-btn${i === periodIdx ? " active" : ""}`}
            onClick={() => onPeriodChange(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <style jsx>{`
        .summary-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .summary-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--fg-2);
          margin-bottom: 6px;
        }

        .summary-amount {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .delta-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
        }

        /* Spending more is bad, spending less is good. */
        .delta-badge.up {
          background: rgba(255, 61, 104, 0.12);
          color: var(--accent-hot);
        }

        .delta-badge.down {
          background: rgba(124, 255, 178, 0.12);
          color: var(--accent);
        }

        .period-tabs {
          display: flex;
          gap: 2px;
          background: var(--bg-2);
          border-radius: var(--r-sm);
          padding: 3px;
          align-self: flex-start;
        }

        .period-btn {
          padding: 5px 12px;
          border-radius: calc(var(--r-sm) - 2px);
          border: none;
          background: transparent;
          color: var(--fg-2);
          font-size: 0.8rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition:
            background 0.15s,
            color 0.15s;
        }

        .period-btn.active {
          background: var(--bg-3);
          color: var(--fg-0);
        }
      `}</style>
    </div>
  );
}
