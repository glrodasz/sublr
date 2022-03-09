import React from "react";
import CreditCardIcon from "./CreditCardIcon";
import Subscription from "./Subscription";

const Summary = ({ data, total }) => {
  return (
    <>
      <div className="summary">
        {data.map((row) => (
          <div key={row.key} className="row">
            <div>
              <CreditCardIcon {...row.creditCard} />
            </div>
            <div>
              <Subscription {...row.monthly} time="MONTHLY" />{" "}
            </div>
            <div>
              <Subscription {...row.yearly} time="YEARLY" />
            </div>
            <div>
              <select value="USD">
                <option value="COP">COP</option>
                <option value="SEK">SEK</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        ))}

        <div className="row">
          <div>
            <span className="subtitle">Total</span>
          </div>
          <div className="subscription">
            <Subscription price={total.monthly} currency="USD" time="MONTHLY" />{" "}
          </div>
          <div className="subscription">
            <Subscription price={total.yearly} currency="USD" time="YEARLY" />
          </div>
          <div>
            <select value="USD">
              <option value="COP">COP</option>
              <option value="SEK">SEK</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </div>
      <style jsx>{`
        .summary {
          display: flex;
          flex-direction: column;
          background: #fff;
          padding-block-start: 20px;
          gap: 20px;
        }

        .row {
          display: flex;
          justify-content: space-around;
        }

        .row:last-child {
          background: #d4d4d8;
          padding-block: 10px;
        }

        .subtitle {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 30px;
        }

        .subscription {
          text-align: right;
        }
      `}</style>
    </>
  );
};

export default Summary;
