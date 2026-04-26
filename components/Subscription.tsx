import React from "react";

import Price from "./Price";
import Select from "./Select";
import type { Currency, TimeAttribute, FieldChange } from "../types";
import { TIME_DESCRIPTION } from "../constants";

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
            <Select
              id="time"
              value={time}
              onChange={onChange!}
              options={Object.entries(TIME_DESCRIPTION).map(([value, label]) => ({ label, value }))}
            />
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

        .period-pill :global(select) {
          min-width: 100px;
          font-size: 0.8em;
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
