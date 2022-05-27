import React from "react";
import Icon from "./Icon";
import Select from "./Select";
import Input from "./Input";

import { CREDIT_CARD_TYPES } from "../constants";
import { getCreditCardIconName } from "../helpers";

const CreditCardIcon = ({ type, number, setValue, isEditable, onChange }) => {
  const iconName = getCreditCardIconName(type);

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
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default CreditCardIcon;
