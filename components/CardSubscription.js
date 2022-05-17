import React from "react";

import CreditCardIcon from "./CreditCardIcon";
import Subscription from "./Subscription";
import Card from './Card'
import Tag from "./Tag";

import { DEFAULT_UNSPLASH_ID } from "../constants";

const CardSubscription = ({
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
      <Card>
        <div
          className="cover"
          style={{
            backgroundImage: `url(https://source.unsplash.com/${unsplashId})`,
          }}
        >
          <h1 className="title">{title}</h1>
          <div className="tags">
            {tags.map((tag) => (
              <Tag key={tag}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <div className="content">
          <Subscription price={price} currency={currency} time={time} />
          <CreditCardIcon {...creditCard} />
        </div>
      </Card>
      <style jsx>{`
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
          gap: 10px;
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
          gap: 10px;
        }
      `}</style>
    </>
  );
};

export default CardSubscription;
