import React from "react";

const Card = ({ children, isInline }) => {
  return (
    <>
      <div className={`card ${isInline ? "is-inline" : ""}`}>{children}</div>
      <style jsx>{`
        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          width: 100%;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
};

export default Card;
