import Head from "next/head";
import auth0 from "../lib/auth0";

import HomeSkeleton from "../components/HomeSkeleton";
import SummaryHeader from "../components/SummaryHeader";
import SubscriptionList from "../components/SubscriptionList";
import TopNav from "../components/TopNav";

import useCurrencyExchangeRates from "../hooks/useCurrencyExchangeRates";
import useSubscriptions from "../hooks/useSubscriptions";
import useSubscriptionFilters from "../hooks/useSubscriptionFilters";
import useSubscriptionMutations from "../hooks/useSubscriptionMutations";
import { useSummary } from "../hooks/useSummary";
import { useUser } from "@auth0/nextjs-auth0/client";
import { needsExchangeRates } from "../helpers";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function Home() {
  const { user } = useUser();
  const {
    subscriptions,
    create,
    remove,
    update,
    finishedFirstFetch,
    error: subscriptionsError,
  } = useSubscriptions();
  const { rates, error: ratesError, isLoading: ratesLoading } = useCurrencyExchangeRates();

  const {
    time,
    setTime,
    currency,
    setCurrency,
    sortBy,
    setSortBy,
    card,
    setCard,
    tags,
    setTags,
    tagOptions,
    filteredSubscriptions,
  } = useSubscriptionFilters(subscriptions, rates);
  const mutations = useSubscriptionMutations(remove, update);

  const { cards } = useSummary(subscriptions, currency, time, rates);
  const { summaryData, uniqueCurrencies, primaryTotal, secondaryTotal, primaryIsYearly } =
    useSummary(filteredSubscriptions, currency, time, rates);

  const isFiltered = Boolean(card) || tags.length > 0;
  const clearFilters = () => {
    setCard("");
    setTags([]);
  };

  const ratesUnavailable =
    needsExchangeRates(subscriptions) && !ratesLoading && (!!ratesError || !rates);

  if (!finishedFirstFetch) {
    return <HomeSkeleton />;
  }

  return (
    <>
      <Head>
        <title>Sublr</title>
        <meta name="theme-color" content="#0A0A0F" />
      </Head>
      <TopNav
        user={user}
        sortBy={sortBy}
        setSortBy={setSortBy}
        currency={currency}
        setCurrency={setCurrency}
        time={time}
        setTime={setTime}
        card={card}
        setCard={setCard}
        tags={tags}
        setTags={setTags}
        tagOptions={tagOptions}
        cards={cards}
      />
      <main className="container">
        {subscriptionsError && (
          <section className="load-error" role="alert">
            <p className="load-error-title">Couldn&apos;t load your subscriptions</p>
            <p className="load-error-body">
              Something went wrong while connecting to the server. Refresh the page to try again.
            </p>
          </section>
        )}
        <SummaryHeader
          subscriptions={filteredSubscriptions}
          time={time}
          currency={currency}
          primaryTotal={primaryTotal}
          secondaryTotal={secondaryTotal}
          primaryIsYearly={primaryIsYearly}
          uniqueCurrencies={uniqueCurrencies}
          summaryData={summaryData}
          ratesUnavailable={ratesUnavailable}
          isFiltered={isFiltered}
          onClearFilters={clearFilters}
        />
        <SubscriptionList
          subscriptions={filteredSubscriptions}
          user={user}
          create={create}
          mutations={mutations}
          knownTags={tagOptions}
        />
      </main>

      <style jsx>{`
        .container {
          width: 100%;
          max-width: 800px;
          padding: 20px 20px 48px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 36px;
        }

        .load-error {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 20px;
          border: 1px solid var(--accent-hot, #ff3d68);
          border-radius: var(--r-lg, 16px);
          background: color-mix(in srgb, var(--accent-hot, #ff3d68) 12%, transparent);
        }

        .load-error-title {
          margin: 0;
          font-weight: 700;
          color: var(--accent-hot, #ff3d68);
        }

        .load-error-body {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-1, #b8b8c8);
        }

        @media only screen and (min-width: 800px) {
          .container {
            max-width: 900px;
          }
        }

        @media only screen and (min-width: 1000px) {
          .container {
            max-width: 1440px;
          }
        }
      `}</style>
    </>
  );
}
