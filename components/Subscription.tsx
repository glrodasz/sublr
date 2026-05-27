import React from "react";

import Price from "./Price";
import Toggle from "./Toggle";
import type { Currency, TimeAttribute, FieldChange } from "../types";

const PERIOD_OPTIONS: { label: string; value: TimeAttribute }[] = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

const PERIOD_PILL: Record<TimeAttribute, string> = {
  MONTHLY: "mo",
  YEARLY: "yr",
};

interface Props {
  price: number;
  currency: Currency;
  time: TimeAttribute;
  size?: "sm" | "md" | "lg" | "xl";
  decimals?: number;
  isEditable?: boolean;
  onChange?: (change: FieldChange) => void;
  periodVariant?: "default" | "compact";
}

const Subscription = ({
  price,
  currency,
  time,
  size = "md",
  decimals,
  isEditable,
  onChange,
  periodVariant = "default",
}: Props) => {
  return (
    <>
      <div className={`subscription ${periodVariant === "compact" ? "is-compact" : ""}`}>
        <Price
          currency={currency}
          size={size}
          decimals={decimals}
          isEditable={isEditable}
          onChange={onChange}
        >
          {price}
        </Price>

        <span className={`period-pill size-${size}`}>
          {isEditable ? (
            <Toggle id="time" value={time} onChange={onChange!} options={PERIOD_OPTIONS} />
          ) : (
            <span className="period-label">{PERIOD_PILL[time] ?? time}</span>
          )}
        </span>
      </div>
      <style jsx>{`
        .subscription {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px 12px;
          font-weight: 600;
        }

        .subscription.is-compact {
          gap: 6px 10px;
        }

        .period-pill {
          display: inline-flex;
          align-items: center;
        }

        .period-label {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 0.7em;
          font-weight: 600;
          font-family: var(--font-mono, ui-monospace, monospace);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--fg-1, #b8b8c8);
          border: 1px solid var(--line, #2a2a38);
          border-radius: 999px;
          background: var(--bg-2, #1c1c26);
        }
      `}</style>
    </>
  );
};

export default Subscription;
