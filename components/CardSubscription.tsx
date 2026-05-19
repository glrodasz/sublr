import React, { useEffect, useState } from "react";

import CreditCardIcon from "./CreditCardIcon";
import Subscription from "./Subscription";
import Card from "./Card";
import Tag from "./Tag";
import type { CardSide, Currency, TimeAttribute, CreditCard, FieldChange } from "../types";
import BacksideCardSubscription from "./BacksideCardSubscription";
import { getTagStyle } from "../lib/tagStyles";

const handleClick =
  ({ side, setSide }: { side: CardSide; setSide: (s: CardSide) => void }) =>
  () => {
    setSide(side === "frontside" ? "backside" : "frontside");
  };

interface Props {
  title?: string;
  tags: string[];
  price: number;
  currency: Currency;
  time: TimeAttribute;
  creditCard?: CreditCard;
  onRemove?: () => void;
  onUpdate?: () => void;
  onRefresh?: () => void;
  onChange: (change: FieldChange) => void;
  isUpdated?: number;
}

const CardSubscription = ({
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
}: Props) => {
  const [side, setSide] = useState<CardSide>("frontside");
  const primaryTag = tags?.[0] ?? "";
  const { color: accent } = getTagStyle(primaryTag);

  useEffect(() => {
    if (isUpdated) {
      setSide("frontside");
    }
  }, [isUpdated]);

  return (
    <>
      <Card
        height={210}
        onClick={handleClick({ side, setSide })}
        side={side}
        backsideContent={
          <BacksideCardSubscription
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
        <div className="receipt" style={{ "--accent-bar": accent } as React.CSSProperties}>
          <div className="cover">
            <h1 className="title">{title || <span className="untitled">Untitled</span>}</h1>
            <div className="tags">
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
          <div className="content">
            <Subscription price={price} currency={currency} time={time} size="md" />
            <div className="cc-row">
              <CreditCardIcon {...creditCard} />
            </div>
          </div>
        </div>
      </Card>
      <style jsx>{`
        .receipt {
          --accent-bar: var(--accent, #7cffb2);
          position: relative;
          min-height: 100%;
          border-left: 3px solid var(--accent-bar);
          transition: transform 0.2s ease;
        }

        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          :global(.frontside-content:hover) .receipt {
            transform: translateY(-3px);
          }
        }

        .cover {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
          color: var(--text, #fff);
          padding: 16px 20px;
          background: var(--bg-2, #1c1c26);
          border-bottom: 1px solid var(--line, #2a2a38);
          border-radius: var(--r-md) var(--r-md) 0 0;
        }

        .title {
          font-family: var(--font-display, "Space Grotesk", system-ui, sans-serif);
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .untitled {
          opacity: 0.6;
        }

        .tags {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 8px;
        }

        .content {
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 12px;
          flex: 1;
        }

        .cc-row {
          display: flex;
          align-items: center;
        }
      `}</style>
    </>
  );
};

export default CardSubscription;
