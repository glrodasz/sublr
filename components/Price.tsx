import React from "react";
import CurrencyInput from "./CurrencyInput";
import Select from "./Select";
import type { Currency, FieldChange } from "../types";
import { LANG_PER_CURRENCY } from "../constants";

const sizeClass: Record<string, string> = {
  sm: "size-sm",
  md: "size-md",
  lg: "size-lg",
  xl: "size-xl",
};

interface Props {
  children: React.ReactNode;
  currency: Currency;
  size?: "sm" | "md" | "lg" | "xl";
  decimals?: number;
  isEditable?: boolean;
  onChange?: (change: FieldChange) => void;
}

const Price = ({ children, currency, size = "md", decimals = 2, isEditable, onChange }: Props) => {
  const price = new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(Number(children));

  return (
    <>
      <div
        className={`container ${isEditable ? "is-editable" : ""} ${
          size ? sizeClass[size] || "" : ""
        }`}
      >
        {isEditable ? (
          <>
            <span className="currency-pill" aria-label={`Currency ${currency}`}>
              <Select
                id="currency"
                value={currency}
                onChange={onChange!}
                options={Object.keys(LANG_PER_CURRENCY).map((key) => ({
                  value: key,
                  label: key,
                }))}
              />
            </span>
            <span className="amount mono tabular-nums">
              <CurrencyInput
                id="price"
                currency={currency}
                value={children as number}
                onChange={onChange}
                className="mono"
              />
            </span>
          </>
        ) : (
          <>
            <span className="amount mono tabular-nums">{price}</span>
            <span className="currency-pill" aria-label={`Currency ${currency}`}>
              <span className="currency-code">{currency}</span>
            </span>
          </>
        )}
      </div>
      <style jsx>{`
        .container {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px 12px;
          max-width: 100%;
        }

        .amount {
          color: var(--fg-0, #f5f5fa);
          font-weight: 600;
          white-space: nowrap;
        }

        .container.is-editable {
          width: 100%;
        }

        .container.is-editable .amount {
          flex: 1;
          min-width: 0;
        }

        .currency-pill {
          display: inline-flex;
          align-items: center;
        }

        .currency-code {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono, ui-monospace, monospace);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--fg-0, #f5f5fa);
          border: 1px solid var(--line-strong, #3a3a4d);
          border-radius: 999px;
          background: var(--bg-2, #1c1c26);
        }

        :global(.is-editable) .currency-pill :global(select) {
          min-width: 88px;
        }

        .size-sm {
          font-size: 1.125rem;
        }

        .size-md {
          font-size: 1.5rem;
        }

        .size-lg {
          font-size: 2rem;
        }

        .size-xl {
          font-size: clamp(2.75rem, 8vw, 5.5rem);
          line-height: 1.05;
          font-weight: 700;
        }

        @media only screen and (min-width: 1000px) {
          .size-sm {
            font-size: var(--font-size-sm);
          }

          .size-md {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </>
  );
};

export default Price;
