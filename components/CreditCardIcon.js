import React from "react";
import Icon from "./Icon";
import Select from "./Select";
import Input from "./Input";

import { getCreditCardType } from "../helpers";
import { CREDIT_CARD_TYPES } from "../constants";

const CreditCardIcon = ({ type, number, setValue, isEditable, onChange }) => {
  const iconName = getCreditCardType(type).toLowerCase();

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
          <Icon name={iconName} />
        )}
        <div className="credit-card-number">
          {isEditable ? (
            <Input
              id="creditCardNumber"
              type="number"
              value={number}
              onChange={onChange}
            />
          ) : (
            number
          )}
        </div>
      </div>
      <style jsx>{`
        .credit-card {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .credit-card-number {
          font-weight: bold;
          font-size: 22px;
          color: #79686d;
        }
      `}</style>
    </>
  );
};

export default CreditCardIcon;
