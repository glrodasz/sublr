import type { Currency } from "../../types";
import { formatAmount } from "../atoms/Amount";

interface Props {
  name: string;
  amount: number;
  currency: Currency;
  meta: string;
}

export function TransactionRow({ name, amount, currency, meta }: Props) {
  return (
    <li className="row">
      <span className="name">{name}</span>
      <span className="right">
        <span className="amount">
          {formatAmount(amount, currency)}
        </span>
        <span className="meta">{meta}</span>
      </span>
      <style jsx>{`
        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .name {
          font-size: 0.85rem;
          color: var(--fg-1);
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          flex-shrink: 0;
          gap: 1px;
        }

        .amount {
          font-family: var(--font-mono, "JetBrains Mono", ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--fg-0);
        }

        .meta {
          font-size: 0.72rem;
          color: var(--fg-2);
        }
      `}</style>
    </li>
  );
}
