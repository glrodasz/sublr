import React from "react";

const LANG_PER_CURRENCY = {
  USD: "en-US",
  COP: "es-CO",
  SEK: "en-SE",
  EUR: "en-IE",
};

const Price = ({ children, currency, size }) => {
  return (
    <>
      <span className={`price ${size && `size-${size}`}`}>
        {new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
          style: "currency",
          currency,
          maximumFractionDigits: currency === "USD" ? 2 : 0,
          minimumFractionDigits: 0,
        }).format(children)}{" "}
        <span className={`currency ${size && `size-${size}`}`}>
          ({currency})
        </span>
      </span>
      <style jsx>{`
        .price {
          color: #111827;
          font-size: 30px;
          font-weight: bold;
          white-space: nowrap;
        }

        .currency {
          color: #6b7280;
          font-size: 26px;
        }

        .size-small {
          font-size: 22px;
        }
      `}</style>
    </>
  );
};

export default Price;
