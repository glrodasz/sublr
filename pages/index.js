import Head from "next/head";

import Card from "../components/Card";
import Summary from "../components/Summary";

import {
  getMonthlySubscriptionGrouppedByCard,
  getSummaryData,
} from "../helpers";

import subscriptions from "../data/subscriptions.json";

export default function Home() {
  const grouppedMonthlySubscriptions =
    getMonthlySubscriptionGrouppedByCard(subscriptions);

  const summaryData = getSummaryData(grouppedMonthlySubscriptions);

  // TODO: Move to a helper function
  const summaryTotal = summaryData.reduce((total, data) => {
    total.monthly = total.monthly + data.monthly.price
    total.yearly = total.yearly + data.yearly.price

    return total
  }, { monthly: 0, yearly: 0 })

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

      <main className="main">
        {subscriptions.map((subcription) => (
          <Card key={subscriptions.title} {...subcription} />
        ))}
      </main>
      <div className="summary">
        <Summary data={summaryData} total={summaryTotal} />
      </div>
      <style jsx>{`
        .main {
          width: min(100% - 40px, 800px);
          margin: 20px auto;
          min-height: 100%;
          display: grid;
          gap: 30px;
          place-content: center;
          grid-template-columns: minmax(300px, 1fr);
          padding-block-end: 300px;
        }

        .summary {
          width: 100%;
          position: fixed;
          bottom: 0;
          box-shadow: 0 -10px -15px 3px rgb(0 0 0 / 0.1),
            0 -4px -6px 4px rgb(0 0 0 / 0.1);
        }

        @media only screen and (min-width: 800px) {
          .main {
            max-width: 900px;
            grid-template-columns: repeat(2, minmax(300px, 1fr));
          }
        }

        @media only screen and (min-width: 1000px) {
          .main {
            max-width: 1200px;
            grid-template-columns: repeat(3, minmax(300px, 1fr));
          }
        }
      `}</style>
    </>
  );
}
