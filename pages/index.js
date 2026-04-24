import Head from "next/head";
import { useState, useRef, useMemo } from "react";
import auth0 from "../lib/auth0";

import CardSubscription from "../components/CardSubscription";
import Subtitle from "../components/Subtitle";
import Price from "../components/Price";
import CreditCard from "../components/CreditCard";
import Filter from "../components/Filter";

import { CREDIT_CARD_TYPES } from "../constants";
import { TIME_ATTRIBUTE } from "../constants";
import useCurrencyExchangeRates from "../hooks/useCurrencyExchangeRates";
import { useUser } from "@auth0/nextjs-auth0/client";

// FIXME: Use the https://github.com/glrodasz/cero-web/blob/master/features/common/hooks/useBreakpoints.js hook instead
import useMedia from "../hooks/useMedia";
import Autocomplete from "../components/Autocomplete";
import useSubscriptions from "../hooks/useSubscriptions";

import {
  getCreditCardInfoFromCurrentSubscription,
  getMonthlySubscriptionGrouppedByCard,
  getSummaryData,
  getSummaryTotal,
  getUsdPrice,
  shouldUpdateSubscriptionPrice,
} from "../helpers";
import CardPlaceholder from "../components/CardPlaceholder";
import HomeSkeleton from "../components/HomeSkeleton";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function Home() {
  // TODO: Refactor to a custom hook called useFilters and use an
  // object to map the filters
  const [time, setTime] = useState("YEARLY");
  const [currency, setCurrency] = useState("USD");
  const [sortBy, setSortBy] = useState("PRICE");
  const [card, setCard] = useState("");
  const [tags, setTags] = useState([]);

  // User
  const { user } = useUser();

  // CRUD
  const { subscriptions, create, remove, update, finishedFirstFetch } =
    useSubscriptions();

  // Temporal states
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
  const [changedSubscriptions, setChangedSubscriptions] = useState({});
  const [updatedSubscriptions, setUpdatedSubscriptions] = useState({});

  // Dialogs
  const deleteConfirmationDialogRef = useRef(null);
  const updateConfirmationDialogRef = useRef(null);

  // FIXME: Use the https://github.com/glrodasz/cero-web/blob/master/features/common/hooks/useBreakpoints.js hook instead
  const isDesktop = useMedia(["(min-width: 992px)"], [true]);
  const isMobile = useMedia(["(max-width: 799px)"], [true]);

  const { rates } = useCurrencyExchangeRates();

  const grouppedMonthlySubscriptions = getMonthlySubscriptionGrouppedByCard(
    subscriptions,
    currency,
    rates
  );

  const cards = Object.keys(grouppedMonthlySubscriptions);
  const summaryData = getSummaryData(grouppedMonthlySubscriptions);
  const summaryTotal = getSummaryTotal(summaryData);

  const uniqueCurrencies = useMemo(
    () => new Set(subscriptions.map((s) => s.currency)).size,
    [subscriptions]
  );

  const primaryTotal =
    time === "YEARLY" ? summaryTotal.yearly : summaryTotal.monthly;
  const secondaryTotal =
    time === "YEARLY" ? summaryTotal.monthly : summaryTotal.yearly;
  const primaryIsYearly = time === "YEARLY";

  const tagOptions = [
    ...new Set(
      subscriptions.flatMap((subscription) =>
        subscription.tags.map((tag) => tag.toLowerCase())
      )
    ),
  ];

  if (!finishedFirstFetch) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <Head>
        <title>Sublr</title>
        <meta name="theme-color" content="#0A0A0F" />
      </Head>
      <nav>
        <div className="nav-inner">
          <section className="row">
            <figure className="logo">
              <img
                alt="Sublr"
                src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`}
              />
            </figure>
            <div className="filters">
              <Filter
                label="Sort by"
                value={sortBy}
                setValue={setSortBy}
                options={[
                  { label: "Price", value: "PRICE" },
                  { label: "Name", value: "NAME" },
                  { label: "Card", value: "CARD" },
                ]}
                isHiddenInMobile
              />
              <Filter
                label="Currency"
                value={currency}
                hideLabel={isMobile}
                setValue={setCurrency}
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
                setValue={setTime}
                variant="segmented"
                options={[
                  { label: "Yearly", value: "YEARLY" },
                  { label: "Monthly", value: "MONTHLY" },
                ]}
              />

              <Filter
                label="Cards"
                value={card}
                setValue={setCard}
                options={[
                  { label: "All", value: "" },
                  ...cards.map((c) => ({
                    label: `${c.split("_")[1]} (${
                      CREDIT_CARD_TYPES[c.split("_")[0]]
                    })`,
                    value: c,
                  })),
                ]}
                isHiddenInMobile
              />

              <Filter label="Tags" isHiddenInMobile>
                <Autocomplete
                  options={tagOptions}
                  values={tags}
                  setValues={setTags}
                />
              </Filter>
            </div>
            {user && (
              <div className="avatar-wrap" title="Signed in">
                <div className="avatar">
                  <img alt="" src={user.picture} />
                </div>
                <span className="status-dot" aria-hidden />
              </div>
            )}
          </section>
        </div>
      </nav>
      <main className="container">
        {subscriptions.length >= 1 && (
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
                {subscriptions.length}{" "}
                {subscriptions.length === 1 ? "sub" : "subs"}
              </span>
              <span className="meta-sep" aria-hidden>
                |
              </span>
              <span>
                {uniqueCurrencies}{" "}
                {uniqueCurrencies === 1 ? "currency" : "currencies"}
              </span>
            </div>
          </section>
        )}

        {subscriptions.length >= 1 && (
          <section>
            <Subtitle>
              Cards · {time === "YEARLY" ? "Yearly" : "Monthly"}
            </Subtitle>
            <div className="cards-rail" role="list">
              {summaryData.map((data) => {
                return (
                  <div className="rail-item" key={data.key} role="listitem">
                    <CreditCard
                      time={time}
                      number={data.creditCard.number}
                      type={data.creditCard.type}
                      currency={data[TIME_ATTRIBUTE[time]].currency}
                      price={data[TIME_ATTRIBUTE[time]].price}
                      decimals={0}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <Subtitle>Subscriptions</Subtitle>
          <div className="cards-container">
            {subscriptions
              .filter(({ creditCard, tags: subscriptionTag }) => {
                if (card) {
                  return `${creditCard.type}_${creditCard.number}` === card;
                }

                if (Array.isArray(tags) && tags.length) {
                  return tags
                    .map((tag) => subscriptionTag.includes(tag))
                    .find(Boolean);
                }

                return true;
              })
              .sort((a, b) => {
                if (sortBy === "NAME") {
                  return a.title.localeCompare(b.title);
                } else if (sortBy === "PRICE") {
                  return (
                    Number(
                      getUsdPrice(
                        b.time === "MONTHLY" ? b.price * 12 : b.price,
                        b.currency,
                        rates
                      )
                    ) -
                    Number(
                      getUsdPrice(
                        a.time === "MONTHLY" ? a.price * 12 : a.price,
                        a.currency,
                        rates
                      )
                    )
                  );
                } else if (sortBy === "CARD") {
                  return a.creditCard.number - b.creditCard.number;
                }

                return 0;
              })
              .map((subscription) => {
                const mergedSubscription = {
                  ...subscription,
                  ...changedSubscriptions[subscription.id],
                  creditCard: {
                    type:
                      changedSubscriptions[subscription.id]?.creditCardType ??
                      subscription.creditCard.type,
                    number:
                      changedSubscriptions[subscription.id]?.creditCardNumber ??
                      subscription.creditCard.number,
                  },
                };

                return (
                  <CardSubscription
                    key={subscription.id}
                    unsplashId={mergedSubscription.unsplashId}
                    title={mergedSubscription.title}
                    tags={mergedSubscription.tags}
                    currency={mergedSubscription.currency}
                    creditCard={mergedSubscription.creditCard}
                    time={mergedSubscription.time}
                    price={mergedSubscription.price}
                    isUpdated={updatedSubscriptions[subscription.id]}
                    onRemove={(event) => {
                      event.stopPropagation();
                      deleteConfirmationDialogRef.current.showModal();
                      setCurrentSubscriptionId(subscription.id);
                    }}
                    onUpdate={(event) => {
                      event.stopPropagation();
                      updateConfirmationDialogRef.current.showModal();
                      setCurrentSubscriptionId(subscription.id);
                    }}
                    onChange={({ id, value }) => {
                      const newValue =
                        id === "creditCardNumber" ? value.slice(-4) : value;

                      setChangedSubscriptions({
                        ...changedSubscriptions,
                        [subscription.id]: {
                          ...changedSubscriptions[subscription.id],
                          ...{
                            [id]: newValue,
                          },
                        },
                      });
                    }}
                  />
                );
              })}
            <CardPlaceholder
              text="Add new subscription"
              onClick={() => {
                create({
                  unsplashId: "wn7dOzUh3Rs",
                  title: "",
                  tags: [],
                  price: 0,
                  currency: "USD",
                  time: "",
                  creditCard: {
                    type: "MASTERCARD",
                    number: 0,
                  },
                  userId: user?.sub,
                });
              }}
            />
          </div>
          <dialog ref={deleteConfirmationDialogRef}>
            <form method="dialog">
              <p>Are you sure that you want to delete it?</p>
              <button
                onClick={() => {
                  remove(currentSubscriptionId);
                }}
              >
                Confirm
              </button>
              <button>Cancel</button>
            </form>
          </dialog>
          <dialog ref={updateConfirmationDialogRef}>
            <form method="dialog">
              <p>Are you sure that you want to update it?</p>
              <button
                onClick={() => {
                  update(currentSubscriptionId, {
                    ...changedSubscriptions[currentSubscriptionId],
                    ...shouldUpdateSubscriptionPrice(
                      changedSubscriptions[currentSubscriptionId]
                    ),
                    ...getCreditCardInfoFromCurrentSubscription(
                      changedSubscriptions[currentSubscriptionId]
                    ),
                  });
                  setUpdatedSubscriptions({
                    ...updatedSubscriptions,
                    ...{
                      [currentSubscriptionId]:
                        (updatedSubscriptions?.[currentSubscriptionId] ?? 0) +
                        1,
                    },
                  });
                }}
              >
                Confirm
              </button>
              <button>Cancel</button>
            </form>
          </dialog>
        </section>
      </main>

      <style jsx>{`
        article,
        section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

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

        .logo {
          max-width: 100px;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .logo > img {
          width: 100%;
          height: auto;
          filter: brightness(0) invert(1)
            drop-shadow(0 0 10px rgba(124, 255, 178, 0.35));
        }

        .row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px 24px;
          flex-wrap: wrap;
        }

        .evenly {
          justify-content: space-evenly;
        }

        .cards-container {
          width: 100%;
          min-height: 100%;
          display: grid;
          gap: 24px;
          place-content: start;
          grid-template-columns: minmax(280px, 1fr);
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

        .container {
          width: 100%;
          max-width: 800px;
          padding: 20px 20px 48px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .summary {
          width: 100%;
          position: fixed;
          bottom: 0;
          box-shadow: 0 -10px 15px 3px rgb(0 0 0 / 0.1),
            0 -4px 6px 4px rgb(0 0 0 / 0.1);
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

        .totals-hero {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px 20px 22px;
          border: 1px solid var(--line, #2a2a38);
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

        .is-yearly
          .hero-number
          :global(.currency-code) {
          border-color: color-mix(
            in srgb,
            var(--accent-hot, #ff3d68) 50%,
            var(--line-strong) 50%
          );
        }

        .is-monthly
          .hero-number
          :global(.currency-code) {
          border-color: color-mix(
            in srgb,
            var(--accent) 50%,
            var(--line-strong) 50%
          );
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

        @media only screen and (min-width: 800px) {
          .container {
            max-width: 900px;
          }

          .cards-container {
            grid-template-columns: repeat(2, minmax(280px, 1fr));
          }
        }

        @media only screen and (min-width: 1000px) {
          .container {
            max-width: 1440px;
          }

          .cards-container {
            grid-template-columns: repeat(3, minmax(280px, 1fr));
          }
        }

        @media only screen and (min-width: 1280px) {
          .cards-container {
            grid-template-columns: repeat(4, minmax(260px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
