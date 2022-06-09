import React from "react";
import Card from "./Card";

const CardPlaceholder = ({ text, onClick }) => {
  return (
    <>
      <Card onClick={onClick}>
        <div className="placeholder">
          <h1>{text}</h1>
        </div>
      </Card>
      <style jsx>
        {`
          .placeholder {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 310px;
          }

          h1 {
            font-weight: bold;
            font-size: 22px;
            color: #79686d;
          }
        `}
      </style>
    </>
  );
};

export default CardPlaceholder;
{
  Card;
}
