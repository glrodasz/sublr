import Head from "next/head";
import auth0 from "../lib/auth0";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function Home() {
  return (
    <>
      <Head>
        <title>Waletto</title>
        <meta name="theme-color" content="#0A0A0F" />
      </Head>
      <main>
        <p>Dashboard coming soon.</p>
      </main>
    </>
  );
}
