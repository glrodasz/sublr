import React from "react";

import { getTimeDescription } from "../helpers";
import Price from "./Price";

const Subscription = ({ price, currency, time, size = "md", decimals }) => {
  return (
    <>
      <div className="subscription">
        <Price currency={currency} size={size} decimals={decimals}>
          {price}
        </Price>
        <span className={`time ${size ? `size-${size}` : ""}`}>
          {getTimeDescription(time)}
        </span>
      </div>
      <style jsx>{`
        .subscription {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: bold;
        }

        .time {
          color: #b87a85;
        }

        .size-sm {
          font-size: 22px;
        }

        .size-md {
          font-size: 30px;
        }

        @media only screen and (min-width: 1000px) {
          .size-md {
            font-size: var(--font-size-md);
          }
        }
      `}</style>
    </>
  );
};

export default Subscription;
