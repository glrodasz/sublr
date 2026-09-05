import type { Currency } from "../../types";
import { LANG_PER_CURRENCY } from "../../constants";

interface Props {
  title: string;
  amount: number;
  currency: Currency;
  breakdown?: string;
  delta?: number;
}

function formatAmount(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TotalCard({ title, amount, currency, breakdown, delta }: Props) {
  const hasDelta = delta !== undefined && delta !== 0;
  const deltaPositive = (delta ?? 0) > 0;

  return (
    <div className="card">
      <span className="title">{title}</span>
      <span className="amount">
        {amount > 0 ? formatAmount(amount, currency) : <span className="empty">—</span>}
      </span>
      {breakdown && <span className="breakdown">{breakdown}</span>}
      {hasDelta && (
        <span className={`delta ${deltaPositive ? "delta--up" : "delta--down"}`}>
          {deltaPositive ? "▲" : "▼"} {Math.abs(delta ?? 0).toFixed(1)}%{" "}
          {deltaPositive ? "more" : "less"} than last month
        </span>
      )}

      <style jsx>{`
        .card {
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line, #2a2a38);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--fg-2, #7a7a9a);
        }

        .amount {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--fg-0, #f0f0f5);
          letter-spacing: -0.03em;
        }

        .empty {
          color: var(--fg-2, #7a7a9a);
        }

        .breakdown {
          font-size: 0.78rem;
          color: var(--fg-1, #b8b8c8);
          line-height: 1.5;
        }

        .delta {
          font-size: 0.78rem;
          margin-top: 4px;
        }

        .delta--up {
          color: #7cffb2;
        }

        .delta--down {
          color: #ff5566;
        }
      `}</style>
    </div>
  );
}
