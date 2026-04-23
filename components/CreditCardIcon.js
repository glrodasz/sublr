import React from "react";
import Icon from "./Icon";
import Select from "./Select";
import Input from "./Input";

import { CREDIT_CARD_TYPES } from "../constants";
import { getCreditCardIconName } from "../helpers";

const CreditCardIcon = ({ type, number, setValue, isEditable, onChange }) => {
  const iconName = getCreditCardIconName(type);
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
            onChange={onChange}
            options={Object.entries(CREDIT_CARD_TYPES).map(
              ([value, label]) => ({ label, value })
            )}
          />
        ) : (
          <span className="icon-wrap" aria-hidden>
            <Icon name={iconName} />
          </span>
        )}
        <div className="credit-card-number mono tabular-nums">
          {isEditable ? (
            <Input
              id="creditCardNumber"
              type="number"
              value={number}
              maxLength={4}
              onChange={onChange}
              className="mono"
            />
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
      `}</style>
    </>
  );
};

export default CreditCardIcon;
