import React, { useState } from "react";
import type { UserProfile } from "@auth0/nextjs-auth0/client";
import type { Currency, TimeAttribute } from "../types";
import { CREDIT_CARD_TYPES } from "../constants";
import useBreakpoints from "../hooks/useBreakpoints";
import Filter from "./Filter";
import TagsInput from "./TagsInput";

interface Props {
  user: UserProfile | undefined;
  sortBy: string;
  setSortBy: (v: string) => void;
  currency: Currency;
  setCurrency: (v: Currency) => void;
  time: TimeAttribute;
  setTime: (v: TimeAttribute) => void;
  card: string;
  setCard: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  tagOptions: string[];
  cards: string[];
}

const TopNav = ({
  user,
  sortBy,
  setSortBy,
  currency,
  setCurrency,
  time,
  setTime,
  card,
  setCard,
  tags,
  setTags,
  tagOptions,
  cards,
}: Props) => {
  const { isMobile, isDesktop } = useBreakpoints();
  const [showSecondaryFilters, setShowSecondaryFilters] = useState(false);
  const secondaryVisible = !isMobile || showSecondaryFilters;

  return (
    <nav>
      <div className="nav-inner">
        <section className="row">
          <figure className="logo">
            <img alt="Sublr" src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`} />
          </figure>
          {isMobile && (
            <button
              type="button"
              className="filters-toggle"
              aria-expanded={showSecondaryFilters}
              onClick={() => setShowSecondaryFilters((open) => !open)}
            >
              {showSecondaryFilters ? "Hide filters" : "Filters"}
            </button>
          )}
          <div className="filters">
            {secondaryVisible && (
              <Filter
                label="Sort by"
                value={sortBy}
                setValue={setSortBy}
                options={[
                  { label: "Price", value: "PRICE" },
                  { label: "Name", value: "NAME" },
                  { label: "Card", value: "CARD" },
                ]}
              />
            )}
            <Filter
              label="Currency"
              value={currency}
              hideLabel={isMobile}
              setValue={(v) => setCurrency(v as Currency)}
              variant="segmented"
              options={[
                { label: "USD", value: "USD" },
                { label: "COP", value: "COP" },
                { label: "EUR", value: "EUR" },
                { label: "SEK", value: "SEK" },
              ]}
            />
            <Filter
              label="Time"
              value={time}
              hideLabel={isMobile}
              setValue={(v) => setTime(v as TimeAttribute)}
              variant="segmented"
              options={[
                { label: "Yearly", value: "YEARLY" },
                { label: "Monthly", value: "MONTHLY" },
              ]}
            />
            {secondaryVisible && (
              <Filter
                label="Cards"
                value={card}
                setValue={setCard}
                options={[
                  { label: "All", value: "" },
                  ...cards.map((c) => ({
                    label: `${c.split("_")[1]} (${CREDIT_CARD_TYPES[c.split("_")[0]]})`,
                    value: c,
                  })),
                ]}
              />
            )}
            {secondaryVisible && (
              <Filter label="Tags">
                <TagsInput
                  options={tagOptions}
                  values={tags}
                  setValues={setTags}
                  placeholder="Filter by tag…"
                />
              </Filter>
            )}
          </div>
          {user && (
            <div className="avatar-wrap" title="Signed in">
              <div className="avatar">
                <img alt="" src={user.picture ?? undefined} />
              </div>
              <span className="status-dot" aria-hidden />
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        nav {
          min-height: 56px;
          display: flex;
          align-items: center;
          background: var(--bg-0, #0a0a0f);
          border-bottom: 1px solid var(--line, #2a2a38);
        }

        .nav-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 8px 20px;
        }

        .row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px 24px;
          flex-wrap: wrap;
        }

        .logo {
          max-width: 100px;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .logo > img {
          width: 100%;
          height: auto;
          filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(124, 255, 178, 0.35));
        }

        .filters-toggle {
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid var(--line-strong, #3a3a4d);
          background: var(--bg-1, #14141b);
          color: var(--fg-1, #b8b8c8);
          cursor: pointer;
        }

        .filters {
          display: flex;
          width: 100%;
          flex: 1 1 auto;
          gap: 12px 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        .avatar-wrap {
          position: relative;
          flex: 0 0 auto;
        }

        .avatar {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 1px solid var(--line-strong, #3a3a4d);
          overflow: hidden;
          background: var(--bg-1, #14141b);
        }

        .avatar > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-dot {
          position: absolute;
          right: -2px;
          top: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent, #7cffb2);
          box-shadow: 0 0 0 2px var(--bg-0, #0a0a0f);
        }
      `}</style>
    </nav>
  );
};

export default TopNav;
