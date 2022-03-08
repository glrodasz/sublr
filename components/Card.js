import React from "react";

const DEFAULT_UNSPLASH_ID = '3zx-cgfbFAg'

const CREDIT_CARD_TYPES = {
  "VISA": 'visa',
  "MASTERCARD": 'mastercard'
}

const TIME_DESCRIPTION = {
  "MONTHLY": '/mo',
  "YEARLY": '/year',
}

const getCreditCardType = type => CREDIT_CARD_TYPES[type]
const getTimeDescription = time => TIME_DESCRIPTION[time]

const Card = ({
  unsplashId = DEFAULT_UNSPLASH_ID,
  title,
  tags,
  price,
  currency,
  time,
  creditCard,
}) => {
  return (
    <>
      <div className="card">
        <div
          className="cover"
          style={{
            backgroundImage: `url(https://source.unsplash.com/${unsplashId})`,
          }}
        >
          <h1 className="title">{title}</h1>
          <div className="tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="content">
          <div className="subscription">
            <span className="price">
              {new Intl.NumberFormat().format(price)} {currency}
            </span>
            <span className="time">{getTimeDescription(time)}</span>
          </div>
          <div className="credit-card">
            <span className="icon">
              <img
                src={`/icons/${
                  getCreditCardType(creditCard.type)
                }.svg`}
              />
            </span>
            <div className="credit-card-number">{creditCard.number}</div>
          </div>
        </div>
      </div>
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

        .cover {
          position: relative;
          height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #fff;
          padding: 10px 20px 20px;
          border-radius: 8px 8px 0 0;
          background-repeat: no-repeat;
          background-size: cover;
        }

        .cover::before {
          content: "";
          position: absolute;
          border-radius: 8px 8px 0 0;
          background: linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.2) 65%
          );
          inset: 0;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          position: relative;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
        }

        .tags {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
          margin-top: 10px;
          position: relative;
        }

        .tag {
          background: #475569;
          padding: 2px 10px;
          border-radius: 14px;
          font-size: 14px;
          text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
          text-transform: capitalize;
        }

        .content {
          display: flex;
          flex-direction: column;
          padding: 20px;
        }

        .subscription {
          display: flex;
          align-items: center;
          font-size: 30px;
          gap: 5px;
          font-weight: bold;
        }

        .price {
          color: #111827;
        }

        .time {
          color: #6b7280;
          font-size: 26px;
        }

        .credit-card {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 10px;
        }

        .credit-card .icon {
          width: 35px;
          line-height: 0;
        }

        .credit-card .icon img {
          width: 100%;
        }

        .credit-card-number {
          font-weight: bold;
          font-size: 22px;
          color: #374151;
        }
      `}</style>
    </>
  );
};

export default Card;
