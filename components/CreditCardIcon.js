import React from "react";

import { getCreditCardType  } from "../helpers";

const CreditCardIcon = ({ type, number }) => {
  return (
    <>
      <div className="credit-card">
        <span className="icon">
          <img src={`/icons/${getCreditCardType(type).toLowerCase()}.svg`} />
        </span>
        <div className="credit-card-number">{number}</div>
      </div>
      <style jsx>{`
        .credit-card {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .credit-card .icon {
          width: 35px;
          line-height: 0;
        }

        .credit-card .icon img {
          width: 100%;
        }

        .credit-card-number {
          font-weight: bold;
          font-size: 22px;
          color: #79686D;
        }
      `}</style>
    </>
  );
};

export default CreditCardIcon;
