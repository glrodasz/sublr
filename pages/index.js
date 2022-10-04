import Head from "next/head";
import { useState, useRef } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import CardSubscription from "../components/CardSubscription";
import Subtitle from "../components/Subtitle";
import Price from "../components/Price";
import CreditCard from "../components/CreditCard";
import Filter from "../components/Filter";

import { CREDIT_CARD_TYPES } from "../constants";
import { TIME_ATTRIBUTE } from "../constants";
import useCurrencyExchangeRates from "../hooks/useCurrencyExchangeRates";
import { useUser } from "@auth0/nextjs-auth0";

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

export const getServerSideProps = withPageAuthRequired();

export default function Home() {
  // TODO: Refactor to a custom hook called useFilters and use an
  // object to map the filters
  const [time, setTime] = useState("YEARLY");
  const [currency, setCurrency] = useState("USD");
  const [sortBy, setSortBy] = useState("PRICE");
  const [card, setCard] = useState("");
  const [tags, setTags] = useState("");

  // User
  const { user, error: userError, loading: userLoading } = useUser();

  // CRUD
  const { subscriptions, create, remove, update } = useSubscriptions();

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

  const tagOptions = [
    ...new Set(
      subscriptions.flatMap((subscription) =>
        subscription.tags.map((tag) => tag.toLowerCase())
      )
    ),
  ];

  // TODO: Move this to the body and create the component pattern Loading/Children
  if (subscriptions == null) {
    return "Loading...";
  }

  return (
    <>
      <Head>
        <title>Sublr</title>
      </Head>
      <nav>
        <div className="container">
          <section className="row">
            <figure className="logo">
              <img
                src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`}
              ></img>
            </figure>
            <div className="filters">
              {/* TODO: show only in Desktop */}
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
                options={[
                  { label: "Yearly", value: "YEARLY" },
                  { label: "Monthly", value: "MONTHLY" },
                ]}
              />

              {/* TODO: show only in Desktop */}
              <Filter
                label="Cards"
                value={card}
                setValue={setCard}
                options={[
                  { label: "All", value: "" },
                  ...cards.map((card) => ({
                    label: `${card.split("_")[1]} (${
                      CREDIT_CARD_TYPES[card.split("_")[0]]
                    })`,
                    value: card,
                  })),
                ]}
                isHiddenInMobile
              />

              {/* TODO: show only in Desktop */}
              <Filter label="Tags" isHiddenInMobile>
                <Autocomplete
                  options={tagOptions}
                  values={tags}
                  setValues={setTags}
                />
              </Filter>
            </div>
            {user && (
              <div className="avatar">
                <img src={user.picture} />
              </div>
            )}
          </section>
        </div>
      </nav>
      <main className="container">
        {subscriptions.length >= 1 && (
          <section className="row">
            {(isDesktop || time === "MONTHLY") && (
              <article>
                <Subtitle>Total Monthly</Subtitle>
                <Price currency={currency} decimals={0} size="lg">
                  {summaryTotal.monthly}
                </Price>
              </article>
            )}
            {(isDesktop || time === "YEARLY") && (
              <article>
                <Subtitle>Total Yearly</Subtitle>
                <Price currency={currency} decimals={0} size="lg">
                  {summaryTotal.yearly}
                </Price>
              </article>
            )}
          </section>
        )}

        {subscriptions.length >= 1 && (
          <section>
            <Subtitle>Cards {time}</Subtitle>
            <div className="cards-container">
              {summaryData.map((data) => {
                return (
                  <CreditCard
                    key={data.key}
                    number={data.creditCard.number}
                    type={data.creditCard.type}
                    currency={data[TIME_ATTRIBUTE[time]].currency}
                    price={data[TIME_ATTRIBUTE[time]].price}
                    decimals={0}
                  />
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

                if (!!tags.length) {
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
                    onChange={({ id, value }) =>
                      setChangedSubscriptions({
                        ...changedSubscriptions,
                        [subscription.id]: {
                          ...changedSubscriptions[subscription.id],
                          ...{ [id]: value },
                        },
                      })
                    }
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
                  userId: user.sub,
                });
              }}
            />
          </div>
          <dialog ref={deleteConfirmationDialogRef}>
            <form method="dialog">
              <p>Are you sure that you want to delete it?</p>
              <button onClick={() => remove(currentSubscriptionId)}>
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
          background: #b51739;
          padding: 12px 0;
        }

        nav > .container {
          padding: 0 20px;
        }

        .logo {
          max-width: 100px;
        }

        .logo > img {
          width: 100%;
        }

        .row {
          flex-direction: row;
          align-items: center;
          gap: 10px 50px;
        }

        .evenly {
          justify-content: space-evenly;
        }

        .cards-container {
          width: 100%;
          min-height: 100%;
          display: grid;
          gap: 30px;
          place-content: center;
          grid-template-columns: minmax(300px, 1fr);
        }

        .container {
          height: 100%;
          width: 100%;
          max-width: 800px;
          padding: 20px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .summary {
          width: 100%;
          position: fixed;
          bottom: 0;
          box-shadow: 0 -10px -15px 3px rgb(0 0 0 / 0.1),
            0 -4px -6px 4px rgb(0 0 0 / 0.1);
        }

        .filters {
          display: flex;
          width: 100%;
          gap: 15px 20px;
          flex-wrap: wrap;
        }

        .avatar {
          display: inline-flex;
          width: 50px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .avatar > img {
          width: 100%;
          border-radius: 50%;
        }

        @media only screen and (min-width: 800px) {
          .container {
            max-width: 900px;
          }

          .cards-container {
            grid-template-columns: repeat(2, minmax(300px, 1fr));
          }
        }

        @media only screen and (min-width: 1000px) {
          .container {
            max-width: 1440px;
          }

          .cards-container {
            grid-template-columns: repeat(3, minmax(300px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
