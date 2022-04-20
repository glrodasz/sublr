import Head from "next/head";
import { useState } from "react";

import CardSubscription from "../components/CardSubscription";
import Subtitle from "../components/Subtitle";
import Price from "../components/Price";
import CreditCard from "../components/CreditCard";

import {
  getMonthlySubscriptionGrouppedByCard,
  getSummaryData,
} from "../helpers";

import subscriptions from "../data/subscriptions.json";

import { TIME_ATTRIBUTE } from "../constants";

export default function Home() {
  const [time, setTime] = useState("MONTHLY");

  const grouppedMonthlySubscriptions =
    getMonthlySubscriptionGrouppedByCard(subscriptions);

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
          <article>
            <Subtitle>Total Monthly</Subtitle>
            <Price currency={"USD"}>{summaryTotal.monthly}</Price>
          </article>
          <article>
            <Subtitle>Total Yearly</Subtitle>
            <Price currency={"USD"}>{summaryTotal.yearly}</Price>
          </article>
        </section>

        <section>
          <Subtitle>Total by Card</Subtitle>
          <div className="cards-container">
            {summaryData.map((data) => {
              return (
                <CreditCard
                  key={data.key}
                  number={data.creditCard.number}
                  type={data.creditCard.type}
                  currency={data[TIME_ATTRIBUTE[time]].currency}
                  time={time}
                  price={data[TIME_ATTRIBUTE[time]].price}
                />
              );
            })}
          </div>
        </section>

        <section>
          <Subtitle>Subscriptions</Subtitle>
          <div className="cards-container">
            {subscriptions.map((subscription) => {
              let price = subscription.price;
              if (
                subscription.time === "MONTHLY" &&
                time === "YEARLY"
              ) {
                price = price * 12;
              } else if (
                subscription.time === "YEARLY" &&
                time === "MONTHLY"
              ) {
                price = price / 12;
              }

              return (
                <CardSubscription
                  key={subscription.title}
                  unsplashId={subscription.unsplashId}
                  title={subscription.title}
                  tags={subscription.tags}
                  currency={subscription.currency}
                  creditCard={subscription.creditCard}
                  time={time}
                  price={price.toFixed(2)}
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
