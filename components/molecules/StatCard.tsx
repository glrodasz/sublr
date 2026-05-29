import type { Currency, Domain } from "../../types";
import { Card } from "../atoms/Card";
import { Amount } from "../atoms/Amount";

interface Props {
  title: string;
  amount: number;
  currency: Currency;
  domain: Domain;
  delta?: number;
}

const DOMAIN_ACCENT: Record<Domain, string> = {
  INCOME: "var(--domain-income)",
  EXPENSE: "var(--domain-expense)",
  INVESTMENT: "var(--domain-investment)",
  SAVING: "var(--domain-saving)",
};

export function StatCard({ title, amount, currency, domain, delta }: Props) {
  const hasDelta = delta !== undefined && delta !== 0;
  const deltaPositive = (delta ?? 0) > 0;

  return (
    <Card accentColor={DOMAIN_ACCENT[domain]}>
      <span className="title">{title}</span>
      <Amount value={amount} currency={currency} size="lg" />
      {hasDelta && (
        <span className={`delta ${deltaPositive ? "up" : "down"}`}>
          {deltaPositive ? "▲" : "▼"} {Math.abs(delta ?? 0).toFixed(1)}%{" "}
          {deltaPositive ? "more" : "less"} than last month
        </span>
      )}
      <style jsx>{`
        .title {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--fg-2);
        }

        .delta {
          font-size: 0.78rem;
          margin-top: 2px;
        }

        .up {
          color: var(--accent);
        }

        .down {
          color: var(--accent-hot);
        }
      `}</style>
    </Card>
  );
}
