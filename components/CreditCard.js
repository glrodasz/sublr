import React from "react";
import Icon from "./Icon";
import { LANG_PER_CURRENCY } from "../constants";
import { getCreditCardIconName } from "../helpers";

const plasticClass = (type) => {
  const t = String(type || "").toLowerCase();
  if (t.includes("visa")) return "visa";
  if (t.includes("master") || t === "mc") return "mc";
  return "default";
};

const CreditCard = ({ type, number, currency, time, price, decimals }) => {
  const brand = plasticClass(String(type));
  const timeKey = time === "YEARLY" || time === "yearly" ? "YEARLY" : "MONTHLY";
  const periodLabel = timeKey === "YEARLY" ? "yr" : "mo";
  const iconName = getCreditCardIconName(type);

  const formatted = new Intl.NumberFormat(LANG_PER_CURRENCY[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: decimals ?? 0,
    minimumFractionDigits: 0,
  }).format(Number(price).toFixed(2));

  const last4 = String(number || "")
    .padStart(4, "0")
    .slice(-4);

  return (
    <>
      <article className={`plastic ${brand}`} data-brand={String(type)}>
        <div className="top">
          <span className="time-pill mono">{periodLabel}</span>
        </div>
        <div className="chip" aria-hidden="true" />
        <div className="row mid">
          <div className="number mono tabular-nums">•••• {last4}</div>
        </div>
        <div className="row bottom">
          <span className="brand" aria-hidden="true">
            <Icon name={iconName} size="md" />
          </span>
          <div className="total-wrap">
            <span className="total-label">Total</span>
            <span className="total mono tabular-nums">{formatted}</span>
          </div>
        </div>
        <div className="shine" aria-hidden="true" />
      </article>
      <style jsx>{`
        .plastic {
          position: relative;
          flex: 0 0 auto;
          width: min(300px, 88vw);
          aspect-ratio: 1.586;
          border-radius: var(--r-md, 10px);
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #f5f5fa;
          border: 1px solid rgb(255 255 255 / 0.12);
          box-shadow: 0 16px 40px rgb(0 0 0 / 0.45),
            inset 0 1px 0 rgb(255 255 255 / 0.1);
          overflow: hidden;
          scroll-snap-align: start;
        }

        .plastic.visa {
          background: linear-gradient(145deg, #1e2a5c 0%, #0f1840 50%, #0a1028 100%);
        }

        .plastic.mc {
          background: linear-gradient(145deg, #2a2a2e 0%, #1a1a1e 50%, #0d0d10 100%);
        }

        .plastic.default {
          background: linear-gradient(145deg, #2d3a4a 0%, #1a222d 50%, #121820 100%);
        }

        .shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            125deg,
            rgb(255 255 255 / 0.12) 0%,
            transparent 42%,
            transparent 100%
          );
          pointer-events: none;
        }

        .top {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: flex-start;
        }

        .time-pill {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #0a0a0f;
          background: rgb(255 255 255 / 0.85);
        }

        .chip {
          position: relative;
          z-index: 1;
          width: 38px;
          height: 28px;
          border-radius: 4px;
          background: linear-gradient(135deg, #e8c87a 0%, #9a7328 100%);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.3);
        }

        .mid {
          position: relative;
          z-index: 1;
          margin-top: 4px;
        }

        .number {
          font-size: 1.05rem;
          letter-spacing: 0.12em;
          text-shadow: 0 1px 2px rgb(0 0 0 / 0.4);
        }

        .bottom {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
        }

        .brand {
          display: inline-flex;
          opacity: 0.9;
          filter: brightness(0) invert(1);
        }

        .total-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          gap: 2px;
        }

        .total-label {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          opacity: 0.75;
        }

        .total {
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          font-weight: 700;
          text-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
        }
      `}</style>
    </>
  );
};

export default CreditCard;
