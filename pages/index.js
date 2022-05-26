import Head from "next/head";
import { useEffect, useState, useRef } from "react";

import CardSubscription from "../components/CardSubscription";
import Subtitle from "../components/Subtitle";
import Price from "../components/Price";
import CreditCard from "../components/CreditCard";
import Filter from "../components/Filter";

import {
  getMonthlySubscriptionGrouppedByCard,
  getSummaryData,
  getUsdPrice,
} from "../helpers";

import { CREDIT_CARD_TYPES } from "../constants";

// import subscriptions from "../data/subscriptions.json";

import { TIME_ATTRIBUTE } from "../constants";
import useCurrencyExchangeRates from "../hooks/useCurrencyExchangeRates";

// FIXME: Use the https://github.com/glrodasz/cero-web/blob/master/features/common/hooks/useBreakpoints.js hook instead
import useMedia from "../hooks/useMedia";
import Autocomplete from "../components/Autocomplete";
import useSubscriptions from "../hooks/useSubscriptions";

export default function Home() {
  // Filters
  const [time, setTime] = useState("YEARLY");
  const [currency, setCurrency] = useState("USD");
  const [sortBy, setSortBy] = useState("PRICE");
  const [card, setCard] = useState("");
  const [tags, setTags] = useState("");

  // CRUD
  const { subscriptions, remove, update } = useSubscriptions();

  const [currentSubscriptionId, setCurrentSubscriptionId] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState({});

  // Dialogs
  const deleteConfirmationDialogRef = useRef(null);
  const updateConfirmationDialogRef = useRef(null);

  const isDesktop = useMedia(["(min-width: 992px)"], [true]);
  const isMobile = useMedia(["(max-width: 799px)"], [true]);

  const { rates } = useCurrencyExchangeRates();

  const grouppedMonthlySubscriptions = getMonthlySubscriptionGrouppedByCard(
    subscriptions,
    currency,
    rates
  );

  const [cards] = useState(Object.keys(grouppedMonthlySubscriptions));

  const summaryData = getSummaryData(grouppedMonthlySubscriptions);

  // TODO: Move to a helper function
  const summaryTotal = summaryData.reduce(
    (total, data) => {
      total.monthly = total.monthly + data.monthly.price;
      total.yearly = total.yearly + data.yearly.price;

      return total;
    },
    { monthly: 0, yearly: 0 }
  );

  const tagOptions = [
    ...new Set(
      subscriptions.flatMap((subscription) =>
        subscription.tags.map((tag) => tag.toLowerCase())
      )
    ),
  ];

  // TODO: Move this to the body and create the component pattern Loading/Children
  if (!subscriptions?.length) {
    return "Loading...";
  }

  return (
    <>
      <Head>
        <title>Sublr</title>
        <meta
          name="description"
          content="Keep your subscriptions summary in one place"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/jgthms/minireset.css@master/minireset.min.css"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@600&family=Open+Sans:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <nav>
        <div className="container">
          <section className="row">
            <figure className="logo">
              <img
                src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`}
              ></img>
            </figure>
            <Filter
              label="Sort by"
              value={sortBy}
              setValue={setSortBy}
              options={[
                { text: "Price", value: "PRICE" },
                { text: "Name", value: "NAME" },
                { text: "Card", value: "CARD" },
              ]}
              isHiddenInMobile
            />
            <Filter
              label="Currency"
              value={currency}
              icon={"coin"}
              showIcon={isMobile}
              setValue={setCurrency}
              options={[
                { text: "USD", value: "USD" },
                { text: "COP", value: "COP" },
                { text: "EUR", value: "EUR" },
                { text: "SEK", value: "SEK" },
              ]}
            />
            <Filter
              label="Time"
              value={time}
              icon={"time"}
              showIcon={isMobile}
              setValue={setTime}
              options={[
                { text: "Yearly", value: "YEARLY" },
                { text: "Monthly", value: "MONTHLY" },
              ]}
            />
            <Filter
              label="Cards"
              value={card}
              setValue={setCard}
              options={[
                { text: "All", value: "" },
                ...cards.map((card) => ({
                  text: `${card.split("_")[1]} (${
                    CREDIT_CARD_TYPES[card.split("_")[0]]
                  })`,
                  value: card,
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
          </section>
        </div>
      </nav>
      <main className="container">
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
                  ...currentSubscription[subscription.id],
                  creditCard: {
                    type:
                      currentSubscription[subscription.id]?.creditCardType ??
                      subscription.creditCard.type,
                    number:
                      currentSubscription[subscription.id]?.creditCardNumber ??
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
                      setCurrentSubscription({
                        ...currentSubscription,
                        [subscription.id]: {
                          ...currentSubscription[subscription.id],
                          ...{ [id]: value },
                        },
                      })
                    }
                  />
                );
              })}
          </div>
          <dialog ref={deleteConfirmationDialogRef}>
            <form method="dialog">
              <p>Are you sure that you want to delete it?</p>
              <button>Cancel</button>
              <button onClick={() => remove(currentSubscriptionId)}>
                Confirm
              </button>
            </form>
          </dialog>
          <dialog ref={updateConfirmationDialogRef}>
            <form method="dialog">
              <p>Are you sure that you want to update it?</p>
              <button>Cancel</button>
              <button
                onClick={() =>
                  update(currentSubscriptionId, {
                    ...currentSubscription[currentSubscriptionId],
                    ...{
                      // FIXME: Only add if creditCardType or creditCardNumber exist
                      creditCard: {
                        type: currentSubscription[currentSubscriptionId]
                          ?.creditCardType,
                        number:
                          currentSubscription[currentSubscriptionId]
                            ?.creditCardNumber,
                      },
                    },
                  })
                }
              >
                Confirm
              </button>
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
          flex-wrap: wrap;
          gap: 20px 30px;
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
            max-width: 1310px;
          }

          .cards-container {
            grid-template-columns: repeat(3, minmax(300px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
