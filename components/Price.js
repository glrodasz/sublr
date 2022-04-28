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
          color: #2d0612;
          font-weight: bold;
          white-space: nowrap;
        }

        .currency {
          color: #b87a85;
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

      `}</style>
    </>
  );
};

export default Price;
