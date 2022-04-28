import Head from "next/head";
import { useState } from "react";

import CardSubscription from "../components/CardSubscription";
import Subtitle from "../components/Subtitle";
import Price from "../components/Price";
import CreditCard from "../components/CreditCard";

import {
  getMonthlySubscriptionGrouppedByCard,
  getSummaryData,
  getUsdPrice,
} from "../helpers";

import { CREDIT_CARD_TYPES } from "../constants";

import subscriptions from "../data/subscriptions.json";

import { TIME_ATTRIBUTE } from "../constants";
import useCurrencyExchangeRates from "../hooks/useCurrencyExchangeRates";

import useMedia from "../hooks/useMedia";

export default function Home() {
  const [time, setTime] = useState("YEARLY");
  const [currency, setCurrency] = useState("USD");
  const [sortBy, setSortBy] = useState("PRICE");
  const [card, setCard] = useState("");

  const isDesktop = useMedia(['(min-width: 992px)'], [true])

  const { rates } = useCurrencyExchangeRates();
  const grouppedMonthlySubscriptions = getMonthlySubscriptionGrouppedByCard(
    subscriptions,
    currency,
    rates
  );

  const [cards, setCards] = useState(Object.keys(grouppedMonthlySubscriptions));

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
      </Head>
      <main className="container">
        <section className="row">
          <fieldset>
            <label>Sort by</label>
            <select onChange={(event) => setSortBy(event.currentTarget.value)}>
              <option value="PRICE" selected={sortBy === "PRICE"}>
                Price
              </option>
              <option value="NAME" selected={sortBy === "NAME"}>
                Name
              </option>
              <option value="CARD" selected={sortBy === "CARD"}>
                Card
              </option>
            </select>
          </fieldset>

          <fieldset>
            <label>Currency</label>
            <select
              onChange={(event) => setCurrency(event.currentTarget.value)}
            >
              <option value="USD" selected={currency === "USD"}>
                USD
              </option>
              <option value="COP" selected={currency === "COP"}>
                COP
              </option>
              <option value="EUR" selected={currency === "EUR"}>
                EUR
              </option>
              <option value="SEK" selected={currency === "SEK"}>
                SEK
              </option>
            </select>
          </fieldset>

          <fieldset>
            <label>Time</label>
            <select onChange={(event) => setTime(event.currentTarget.value)}>
              <option value="YEARLY" selected={time === "YEARLY"}>
                /yearly
              </option>
              <option value="MONTHLY" selected={time === "MONTHLY"}>
                /mo
              </option>
            </select>
          </fieldset>

          <fieldset>
            <label>Cards</label>
            <select onChange={(event) => setCard(event.currentTarget.value)}>
              <option value="" selected={card === ""}>
                All
              </option>
              {cards.map((card) => (
                <option key={card} value={card}>
                  {card.split("_")[1]} ({CREDIT_CARD_TYPES[card.split("_")[0]]})
                </option>
              ))}
            </select>
          </fieldset>
        </section>
        <section className="row">
          {(isDesktop || time === "MONTHLY") && <article>
            <Subtitle>Total Monthly</Subtitle>
            <Price currency={currency} decimals={0}>{summaryTotal.monthly}</Price>
          </article>}
          {(isDesktop || time === "YEARLY") && <article>
            <Subtitle>Total Yearly</Subtitle>
            <Price currency={currency} decimals={0}>{summaryTotal.yearly}</Price>
          </article>}
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
              .filter(({ creditCard }) => {
                if (card) {
                  return `${creditCard.type}_${creditCard.number}` === card;
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
                return (
                  <CardSubscription
                    key={subscription.title}
                    unsplashId={subscription.unsplashId}
                    title={subscription.title}
                    tags={subscription.tags}
                    currency={subscription.currency}
                    creditCard={subscription.creditCard}
                    time={subscription.time}
                    price={subscription.price.toFixed(2)}
                  />
                );
              })}
          </div>
        </section>
      </main>

      <style jsx>{`
        article,
        section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        section.row {
          flex-direction: row;
          flex-wrap: wrap;
          gap: 20px 30px;
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
