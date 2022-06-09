import React, { useState } from "react";
import Input from "./Input";
import Tag from "./Tag";
import Subscription from "./Subscription";
import CreditCardIcon from "./CreditCardIcon";
import Icon from "./Icon";

const BacksideCardSubscription = ({
  unsplashId,
  title,
  tags: originalTags,
  price,
  currency,
  time,
  creditCard,
  onChange,
  onRemove,
  onUpdate,
  onRefresh,
}) => {
  const [tags, setTags] = useState(originalTags.join(", "));

  return (
    <>
      <div className="backside-content">
        <div
          className="cover"
          style={{
            backgroundImage: `url(https://source.unsplash.com/${unsplashId})`,
          }}
        >
          <div className="title">
            <Input placeholder="Subscription title" id="title" value={title} onChange={onChange} />
          </div>
          <div className="tags">
            <Input
              placeholder="Tags comma separated..."
              id="tags"
              value={tags}
              onChange={({ value }) => setTags(value)}
              onBlur={({ id, value }) => {
                onChange({
                  id,
                  value: value
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean),
                });
              }}
            />
          </div>
        </div>
        <div className="content">
          <Subscription
            price={price}
            currency={currency}
            time={time}
            onChange={onChange}
            isEditable
          />
          <CreditCardIcon {...creditCard} isEditable onChange={onChange} />
        </div>
        <div className="actions">
          <div className="circle-button update" onClick={onUpdate}>
            <Icon name="check" size="lg" />
          </div>
          {onRefresh && (
            <div className="circle-button refresh" onClick={onRefresh}>
              <Icon name="refresh" size="lg" />
            </div>
          )}
          <div className="circle-button cancel" onClick={onRemove}>
            <Icon name="trash" size="lg" />
          </div>
        </div>
      </div>
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

        .backside-content {
          position: relative;
        }

        .actions {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .circle-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          padding: 5px;
          border-radius: 50%;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          cursor: pointer;
        }

        .circle-button.update {
          background: #bbf7d0;
        }

        .circle-button.refresh {
          background: #fff;
        }

        .circle-button.cancel {
          background: #fecaca;
        }
      `}</style>
    </>
  );
};

export default BacksideCardSubscription;
