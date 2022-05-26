import React from "react";
import Input from "./Input";
import Select from "./Select";

import { LANG_PER_CURRENCY } from "../constants";

const Price = ({
  children,
  currency,
  size,
  decimals = 2,
  isEditable,
  onChange,
}) => {
  const price = new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(Number(children).toFixed(2));

  return (
    <>
      <div
        className={`container ${isEditable ? "is-editable" : ""} ${
          size ? `size-${size}` : ""
        }`}
      >
        <span className="price">
          {isEditable ? (
            <Input id="price" value={children} onChange={onChange} />
          ) : (
            price
          )}{" "}
          <span className="currency">
            (
            {isEditable ? (
              <Select
                id="currency"
                value={currency}
                onChange={onChange}
                options={Object.keys(LANG_PER_CURRENCY).map((key) => ({
                  value: key,
                  label: key,
                }))}
              />
            ) : (
              currency
            )}
            )
          </span>
        </span>
      </div>
      <style jsx>{`
        .price {
          display: inline-flex;
          align-items: center;
          color: #2d0612;
          font-weight: bold;
          gap: 10px;
          white-space: nowrap;
          width: 100%;
        }

        .currency {
          display: inline-flex;
          align-items: center;
          color: #b87a85;
        }

        .container.is-editable {
          width: 100%;
        }

        .size-sm {
          font-size: 22px;
        }

        .size-md {
          font-size: 30px;
        }

        .size-lg {
          font-size: 35px;
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
