import { Card } from "../../../components/atoms/Card";
import { Amount, formatAmount } from "../../../components/atoms/Amount";
import type { Currency } from "../../../types";
import type { MoneyFlow } from "../../../helpers";

interface Props {
  flow: MoneyFlow;
  currency: Currency;
  /** Aggregates converted with real FX rates get the "≈" marker. */
  approximate?: boolean;
}

/**
 * The hero figure: monthly net = income − expenses − savings − investments
 * (the owner's definition — cash left unallocated). Savings and investments
 * are money that stays yours, so they get their own allocation line instead
 * of being lumped in with spending.
 */
export function NetFlowCard({ flow, currency, approximate = false }: Props) {
  return (
    <Card>
      <span className="title">Net this month</span>
      <Amount value={flow.net} currency={currency} size="lg" colorize approximate={approximate} />
      <span className="equation">
        {formatAmount(flow.income, currency)} in − {formatAmount(flow.expenses, currency)} out
      </span>
      <span className="allocation">
        → savings {formatAmount(flow.savings, currency)}
        <span className="sep"> · </span>
        investments {formatAmount(flow.investments, currency)}
      </span>
      <style jsx>{`
        .title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--fg-2);
        }

        .equation {
          font-size: 0.8rem;
          color: var(--fg-1);
        }

        .allocation {
          font-size: 0.78rem;
          color: var(--fg-2);
        }

        .sep {
          color: var(--line-strong);
        }
      `}</style>
    </Card>
  );
}
