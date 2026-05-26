import React from "react";
import Icon from "./Icon";
import Select from "./Select";
import Input from "./Input";
import type { FieldChange } from "../types";
import { CREDIT_CARD_TYPES } from "../constants";
import { getCreditCardIconName } from "../helpers";

interface Props {
  type?: string;
  number?: number | string | null;
  isEditable?: boolean;
  onChange?: (change: FieldChange) => void;
}

const lastFourDigits = (value: FieldChange["value"]) => String(value).replace(/\D/g, "").slice(-4);

const CreditCardIcon = ({ type, number, isEditable, onChange }: Props) => {
  const iconName = getCreditCardIconName(type ?? "");
  const display =
    number === 0 || number === "0" || number === null || number === undefined
      ? "····"
      : String(number).padStart(4, "0").slice(-4);

  return (
    <>
      <div className="credit-card">
        {isEditable ? (
          <Select
            id="creditCardType"
            value={type}
            onChange={onChange!}
            options={Object.entries(CREDIT_CARD_TYPES).map(([value, label]) => ({ label, value }))}
          />
        ) : (
          <span className="icon-wrap" aria-hidden>
            <Icon name={iconName} />
          </span>
        )}
        <div className="credit-card-number mono tabular-nums">
          {isEditable ? (
            <span className="masked-input">
              <span className="mask-prefix" aria-hidden>
                ••••
              </span>
              <Input
                id="creditCardNumber"
                type="text"
                value={number === 0 || number === "0" ? "" : (number ?? undefined)}
                placeholder="0000"
                onChange={(change) => onChange!({ ...change, value: lastFourDigits(change.value) })}
                className="mono"
              />
            </span>
          ) : (
            <span>•••• {display}</span>
          )}
        </div>
      </div>
      <style jsx>{`
        .credit-card {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .icon-wrap {
          display: inline-flex;
          opacity: 0.85;
          filter: grayscale(1) brightness(1.2);
        }

        .credit-card-number {
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--fg-0, #f5f5fa);
          width: 100%;
        }

        .masked-input {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .mask-prefix {
          color: var(--fg-1, #b8b8c8);
          letter-spacing: 0.1em;
          user-select: none;
        }

        .masked-input :global(input) {
          flex: 1;
          min-width: 0;
        }
      `}</style>
    </>
  );
};

export default CreditCardIcon;
