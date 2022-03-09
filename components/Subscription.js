import React from "react";

import { getTimeDescription } from "../helpers";

const Subscription = ({ price, currency, time }) => {
  return (
    <>
      <div className="subscription">
        <span className="price">
          {new Intl.NumberFormat().format(price)} {currency}
        </span>
        <span className="time">{getTimeDescription(time)}</span>
      </div>
      <style jsx>{`
        .subscription {
          display: flex;
          align-items: center;
          font-size: 30px;
          gap: 5px;
          font-weight: bold;
        }

        .price {
          color: #111827;
        }

        .time {
          color: #6b7280;
          font-size: 26px;
        }
      `}</style>
    </>
  );
};

export default Subscription;
