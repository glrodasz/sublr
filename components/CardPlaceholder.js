import React from "react";
import Card from "./Card";

const CardPlaceholder = ({ text, onClick }) => {
  return (
    <>
      <Card onClick={onClick}>
        <div className="placeholder">
          <span className="plus" aria-hidden="true">
            +
          </span>
          <p className="label">{text}</p>
        </div>
      </Card>
      <style jsx>
        {`
          .placeholder {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 310px;
            gap: 12px;
            border: 2px dashed var(--accent, #7cffb2);
            border-radius: var(--r-md, 10px);
            margin: 0;
            background: transparent;
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease;
          }

          .placeholder:hover {
            background: var(--bg-2, #1c1c26);
            border-color: var(--fg-1, #b8b8c8);
          }

          .plus {
            font-family: var(--font-display, system-ui, sans-serif);
            font-size: 3rem;
            font-weight: 700;
            line-height: 1;
            color: var(--accent, #7cffb2);
          }

          .label {
            margin: 0;
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--fg-1, #b8b8c8);
            text-align: center;
            max-width: 12rem;
          }
        `}
      </style>
    </>
  );
};

export default CardPlaceholder;
