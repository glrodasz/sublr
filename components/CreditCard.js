import React from "react";
import Card from "./Card";
import CreditCardIcon from "./CreditCardIcon";
import Subscription from "./Subscription";

const CreditCard = ({ type, number, currency, time, price }) => {
  return (
    <>
      <Card isInline>
        <div className="container">
          <CreditCardIcon number={number} type={type} />
          <Subscription price={price} currency={currency} time={time} size="small" />
        </div>
      </Card>
      <style jsx>{`
        .container {
          display: flex;
		  justify-content: space-between;
          gap: 20px;
          padding: 15px 20px;
        }
      `}</style>
    </>
  );
};

export default CreditCard;
