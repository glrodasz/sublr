import React from "react";
import Input from "./Input";
import Subscription from "./Subscription";
import CreditCardIcon from "./CreditCardIcon";
import Icon from "./Icon";
import TagsInput from "./TagsInput";
import type { Currency, TimeAttribute, CreditCard, FieldChange } from "../types";

interface Props {
  title?: string;
  tags: string[];
  knownTags?: string[];
  price: number;
  currency: Currency;
  time: TimeAttribute;
  creditCard?: CreditCard;
  onChange: (change: FieldChange) => void;
  onRemove?: () => void;
  onUpdate?: () => void;
  onRefresh?: () => void;
}

const BacksideCardSubscription = ({
  title,
  tags: originalTags,
  knownTags = [],
  price,
  currency,
  time,
  creditCard,
  onChange,
  onRemove,
  onUpdate,
  onRefresh,
}: Props) => {
  return (
    <>
      <div className="backside-content">
        <div className="cover">
          <div className="title">
            <Input placeholder="Subscription title" id="title" value={title} onChange={onChange} />
          </div>
          <div className="tags">
            <TagsInput
              creatable
              options={knownTags}
              values={originalTags}
              setValues={(next) => onChange({ id: "tags", value: next })}
              placeholder="Add tags…"
            />
          </div>
        </div>
        <div className="content">
          <div className="field">
            <span className="field-label">Plan price</span>
            <Subscription
              price={price}
              currency={currency}
              time={time}
              onChange={onChange}
              isEditable
              periodVariant="compact"
            />
          </div>
          <div className="field">
            <span className="field-label">Payment method</span>
            <CreditCardIcon {...creditCard} isEditable onChange={onChange} />
          </div>
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
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: var(--text, #fff);
          padding: 12px 18px;
          background: var(--bg-3, #242433);
          border-bottom: 1px solid var(--line-strong, #3a3a4d);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05);
          border-radius: 8px 8px 0 0;
          gap: 8px;
        }

        .title {
          font-size: 20px;
          font-weight: bold;
        }

        .tags {
          display: flex;
          justify-content: flex-start;
          gap: 10px;
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
          padding: 12px 18px;
          gap: 10px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .field-label {
          font-size: 0.65rem;
          font-weight: 600;
          line-height: 1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--fg-1, #b8b8c8);
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
          box-shadow:
            0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          cursor: pointer;
        }

        .circle-button.update {
          background: var(--accent, #7cffb2);
          color: #0a0a0f;
        }

        .circle-button.refresh {
          background: var(--bg-2, #1c1c26);
          border: 1px solid var(--line, #2a2a38);
        }

        .circle-button.cancel {
          background: color-mix(in srgb, var(--accent-hot, #ff3d68) 25%, transparent);
          border: 1px solid var(--accent-hot, #ff3d68);
        }

        :global(input),
        :global(select) {
          max-width: 100%;
        }
      `}</style>
    </>
  );
};

export default BacksideCardSubscription;
