import React, { useEffect, useState } from "react";

import CreditCardIcon from "./CreditCardIcon";
import Subscription from "./Subscription";
import Card from "./Card";
import Tag from "./Tag";
import Input from "./Input";

import { DEFAULT_UNSPLASH_ID } from "../constants";
import Icon from "./Icon";
import BacksideCardSubscription from "./BacksideCardSubscription";

const FRONTSIDE = Symbol("frontside");
const BACKSIDE = Symbol("backside");

const CardSides = {
  Frontside: FRONTSIDE,
  Backside: BACKSIDE,
};

const getCardSidesString = (side) => {
  if (side === CardSides.Frontside) {
    return "frontside";
  }

  if (side === CardSides.Backside) {
    return "backside";
  }
};

const handleClick =
  ({ side, setSide }) =>
  () => {
    if (side === CardSides.Frontside) {
      setSide(CardSides.Backside);
    }

    if (side === CardSides.Backside) {
      setSide(CardSides.Frontside);
    }
  };

const CardSubscription = ({
  unsplashId = DEFAULT_UNSPLASH_ID,
  title,
  tags,
  price,
  currency,
  time,
  creditCard,
  onRemove,
  onUpdate,
  onRefresh,
  onChange,
  isUpdated = 0,
}) => {
  const [side, setSide] = useState(CardSides.Frontside);

  useEffect(() => {
    if (isUpdated) {
      setSide(CardSides.Frontside);
    }
  }, [isUpdated]);

  return (
    <>
      <Card
        height={310}
        onClick={handleClick({ side, setSide })}
        side={getCardSidesString(side)}
        backsideContent={
          <BacksideCardSubscription
            unsplashId={unsplashId}
            title={title}
            tags={tags}
            price={price}
            currency={currency}
            time={time}
            creditCard={creditCard}
            onChange={onChange}
            onRemove={onRemove}
            onUpdate={onUpdate}
            onRefresh={onRefresh}
          />
        }
      >
        <div
          className="cover"
          style={{
            backgroundImage: `url(https://source.unsplash.com/${unsplashId})`,
          }}
        >
          <h1 className="title">{title}</h1>
          <div className="tags">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
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
