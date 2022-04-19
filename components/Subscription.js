import React from "react";

import { getTimeDescription } from "../helpers";
import Price from "./Price";

const Subscription = ({ price, currency, time, size }) => {
  return (
    <>
      <div className="subscription">
        <Price currency={currency} size={size}>
          {price}
        </Price>
        <span className="time">{getTimeDescription(time)}</span>
      </div>
      <style jsx>{`
        .subscription {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: bold;
        }

        .subscription.size-small {
          font-size: 24px;
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
