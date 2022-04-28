import React from "react";

const LANG_PER_CURRENCY = {
  USD: "en-US",
  COP: "es-CO",
  SEK: "en-SE",
  EUR: "en-IE",
};

const Price = ({ children, currency, size, decimals = 2 }) => {
  return (
    <>
      <div className={`container ${size ? `size-${size}` : ""}`}>
        <span className="price">
          {new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
            style: "currency",
            currency,
            maximumFractionDigits: decimals,
            minimumFractionDigits: 0,
          }).format(children)}{" "}
          <span className="currency">({currency})</span>
        </span>
      </div>
      <style jsx>{`
        .price {
          color: #111827;
          font-weight: bold;
          white-space: nowrap;
        }

        .currency {
          color: #6b7280;
        }

        .size-md {
          font-size: 30px;
        }

        .size-sm {
          font-size: 22px;
        }
      `}</style>
    </>
  );
};

export default Price;
