import React from "react";

const Price = ({ children, currency, size }) => {
  return (
    <>
      <span className={`price ${size && `size-${size}`}`}>
        {new Intl.NumberFormat().format(children)} {currency}
      </span>
      <style jsx>{`
        .price {
          color: #111827;
          font-size: 30px;
          font-weight: bold;
        }

        .size-small {
          font-size: 20px;
        }
      `}</style>
    </>
  );
};

export default Price;
