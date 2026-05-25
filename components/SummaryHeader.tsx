import React from "react";
import type { Currency, TimeAttribute, SummaryEntry, Subscription } from "../types";
import Price from "./Price";
import CreditCard from "./CreditCard";
import Subtitle from "./Subtitle";

interface Props {
  subscriptions: Subscription[];
  time: TimeAttribute;
  currency: Currency;
  primaryTotal: number;
  secondaryTotal: number;
  primaryIsYearly: boolean;
  uniqueCurrencies: number;
  summaryData: SummaryEntry[];
  ratesUnavailable?: boolean;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

const SummaryHeader = ({
  subscriptions,
  time,
  currency,
  primaryTotal,
  secondaryTotal,
  primaryIsYearly,
  uniqueCurrencies,
  summaryData,
  ratesUnavailable = false,
  isFiltered = false,
  onClearFilters,
}: Props) => {
  if (subscriptions.length < 1 && !isFiltered) return null;

  if (ratesUnavailable) {
    return (
      <section className="rates-warning" role="alert">
        <p className="rates-warning-title">Totals unavailable</p>
        <p className="rates-warning-body">
          Exchange rates failed to load, so multi-currency totals can&apos;t be calculated reliably.
          Showing them now would be misleading — please retry shortly.
        </p>
        <style jsx>{`
          .rates-warning {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 16px 20px;
            border: 1px solid var(--accent-hot, #ff3d68);
            border-radius: var(--r-lg, 16px);
            background: color-mix(in srgb, var(--accent-hot, #ff3d68) 12%, transparent);
          }
          .rates-warning-title {
            margin: 0;
            font-weight: 700;
            color: var(--accent-hot, #ff3d68);
          }
          .rates-warning-body {
            margin: 0;
            font-size: 0.85rem;
            color: var(--fg-1, #b8b8c8);
          }
        `}</style>
      </section>
    );
  }

  return (
    <>
      <section className="totals-hero">
        <div className={`hero-figure ${primaryIsYearly ? "is-yearly" : "is-monthly"}`}>
          <p className="hero-kicker">
            Total {primaryIsYearly ? "yearly" : "monthly"}{" "}
            <span className="hero-pill mono">{currency}</span>
          </p>
          <div className="hero-number">
            <Price currency={currency} decimals={0} size="xl">
              {primaryTotal}
            </Price>
          </div>
        </div>
        <div className="hero-meta">
          <span>
            {primaryIsYearly ? "Monthly" : "Yearly"} ·{" "}
            <span className="meta-value mono">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency,
                maximumFractionDigits: 0,
              }).format(secondaryTotal)}
            </span>
          </span>
          <span className="meta-sep" aria-hidden>
            |
          </span>
          <span>
            {subscriptions.length} {subscriptions.length === 1 ? "sub" : "subs"}
          </span>
          <span className="meta-sep" aria-hidden>
            |
          </span>
          <span>
            {uniqueCurrencies} {uniqueCurrencies === 1 ? "currency" : "currencies"}
          </span>
          {isFiltered && (
            <>
              <span className="meta-sep" aria-hidden>
                |
              </span>
              <span className="filtered-tag">
                filtered
                <span className="meta-sep" aria-hidden>
                  ·
                </span>
                <button type="button" className="clear-filters" onClick={onClearFilters}>
                  clear filters
                </button>
              </span>
            </>
          )}
        </div>
      </section>

      {summaryData.length > 0 && (
        <section>
          <Subtitle>Cards · {time === "YEARLY" ? "Yearly" : "Monthly"}</Subtitle>
          <div className="cards-rail" role="list">
            {summaryData.map((data) => (
              <div className="rail-item" key={data.key} role="listitem">
                <CreditCard
                  time={time}
                  number={data.creditCard.number}
                  type={data.creditCard.type}
                  currency={(time === "YEARLY" ? data.yearly : data.monthly).currency ?? "USD"}
                  price={(time === "YEARLY" ? data.yearly : data.monthly).price}
                  decimals={0}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .totals-hero {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px 20px 22px;
          border: 1px solid var(--line-strong, #3a3a4d);
          border-radius: var(--r-lg, 16px);
          background: var(--bg-1, #14141b);
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04);
        }

        .hero-figure {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hero-figure.is-monthly {
          color: var(--accent, #7cffb2);
        }

        .hero-figure.is-yearly {
          color: var(--accent-hot, #ff3d68);
        }

        .hero-kicker {
          margin: 0;
          font-size: 0.7rem;
          font-weight: 600;
          font-family: var(--font-mono, ui-monospace, monospace);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--fg-1, #b8b8c8);
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .hero-pill {
          display: inline-flex;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.65rem;
          color: #0a0a0f;
          background: var(--accent, #7cffb2);
        }

        .is-yearly .hero-pill {
          background: var(--accent-hot, #ff3d68);
          color: #fff;
        }

        .hero-number {
          margin-top: 4px;
        }

        .hero-number :global(.currency-code) {
          color: var(--fg-0, #f5f5fa);
          border-color: var(--line-strong, #3a3a4d);
        }

        .is-yearly .hero-number :global(.amount) {
          color: var(--accent-hot, #ff3d68);
        }

        .is-monthly .hero-number :global(.amount) {
          color: var(--accent, #7cffb2);
        }

        .is-yearly .hero-number :global(.currency-code) {
          border-color: color-mix(in srgb, var(--accent-hot, #ff3d68) 50%, var(--line-strong) 50%);
        }

        .is-monthly .hero-number :global(.currency-code) {
          border-color: color-mix(in srgb, var(--accent) 50%, var(--line-strong) 50%);
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px 12px;
          font-size: 0.8rem;
          color: var(--fg-2, #6e6e85);
        }

        .meta-value {
          color: var(--fg-0, #f5f5fa);
        }

        .meta-sep {
          opacity: 0.4;
        }

        .filtered-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--accent, #7cffb2) 40%, var(--line-strong) 60%);
          color: var(--accent, #7cffb2);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .clear-filters {
          background: transparent;
          border: none;
          padding: 0;
          font: inherit;
          color: var(--fg-1, #b8b8c8);
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .clear-filters:hover {
          color: var(--accent, #7cffb2);
        }

        .cards-rail {
          display: flex;
          flex-direction: row;
          gap: 20px;
          width: 100%;
          padding: 4px 0 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-color: var(--line-strong) var(--bg-1);
        }

        .rail-item {
          flex: 0 0 auto;
        }
      `}</style>
    </>
  );
};

export default SummaryHeader;
