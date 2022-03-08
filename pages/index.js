import Head from "next/head";
import Card from "../components/Card";

import subscriptions from '../data/subscriptions.json'

export default function Home() {
  return (
    <>
      <Head>
        <title>Sublr</title>
        <meta name="description" content="Keep your subscriptions summary in one place" />
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
      <style jsx>{`
        .main {
          padding: 0 20px;
          min-height: 100%;
          display: grid;
          gap: 30px;
          place-content: center;
          max-width: 800px;
          margin: 20px auto;
          grid-template-columns: minmax(300px, 1fr);
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
