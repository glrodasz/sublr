import type { Currency } from "../../types";
import { LANG_PER_CURRENCY } from "../../constants";

interface Props {
  value: number;
  currency: Currency;
  size?: "sm" | "md" | "lg";
  colorize?: boolean;
}

const SIZE_MAP = {
  sm: "0.85rem",
  md: "1.1rem",
  lg: "1.9rem",
};

export function formatAmount(value: number, currency: Currency): string {
  return new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function Amount({ value, currency, size = "md", colorize = false }: Props) {
  const color = colorize
    ? value >= 0
      ? "var(--accent)"
      : "var(--accent-hot)"
    : "var(--fg-0)";

  return (
    <span className="amount">
      {value > 0 ? formatAmount(value, currency) : <span className="empty">—</span>}
      <style jsx>{`
        .amount {
          font-family: var(--font-mono, "JetBrains Mono", ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
          font-size: ${SIZE_MAP[size]};
          font-weight: 700;
          letter-spacing: -0.03em;
          color: ${color};
        }

        .empty {
          color: var(--fg-2);
          font-family: var(--font-sans, "Inter", system-ui, sans-serif);
        }
      `}</style>
    </span>
  );
}
