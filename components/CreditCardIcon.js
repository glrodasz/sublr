import React from "react";
import Icon from "./Icon";

import { getCreditCardType } from "../helpers";

const CreditCardIcon = ({ type, number }) => {
  const iconName = getCreditCardType(type).toLowerCase();

  return (
    <>
      <div className="credit-card">
        <Icon name={iconName} />
        <div className="credit-card-number">{number}</div>
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
