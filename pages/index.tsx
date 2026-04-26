import Head from "next/head";
import { useMemo } from "react";
import type { Currency, TimeAttribute } from "../types";
import auth0 from "../lib/auth0";

import Filter from "../components/Filter";
import Autocomplete from "../components/Autocomplete";
import HomeSkeleton from "../components/HomeSkeleton";
import SummaryHeader from "../components/SummaryHeader";
import SubscriptionList from "../components/SubscriptionList";

import { CREDIT_CARD_TYPES } from "../constants";
import useCurrencyExchangeRates from "../hooks/useCurrencyExchangeRates";
import useMedia from "../hooks/useMedia";
import useSubscriptions from "../hooks/useSubscriptions";
import useSubscriptionFilters from "../hooks/useSubscriptionFilters";
import useSubscriptionMutations from "../hooks/useSubscriptionMutations";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getMonthlySubscriptionGroupedByCard, getSummaryData, getSummaryTotal } from "../helpers";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function Home() {
  const { user } = useUser();
  const { subscriptions, create, remove, update, finishedFirstFetch } = useSubscriptions();
  const { rates } = useCurrencyExchangeRates();

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

  // FIXME: Use the https://github.com/glrodasz/cero-web/blob/master/features/common/hooks/useBreakpoints.js hook instead
  const isDesktop = useMedia(["(min-width: 992px)"], [true]);
  const isMobile = useMedia(["(max-width: 799px)"], [true]);

  const groupedMonthlySubscriptions = getMonthlySubscriptionGroupedByCard(
    subscriptions,
    currency,
    rates
  );
  const cards = Object.keys(groupedMonthlySubscriptions);
  const summaryData = getSummaryData(groupedMonthlySubscriptions);
  const summaryTotal = getSummaryTotal(summaryData);
  const uniqueCurrencies = useMemo(
    () => new Set(subscriptions.map((s) => s.currency)).size,
    [subscriptions]
  );
  const primaryTotal = time === "YEARLY" ? summaryTotal.yearly : summaryTotal.monthly;
  const secondaryTotal = time === "YEARLY" ? summaryTotal.monthly : summaryTotal.yearly;
  const primaryIsYearly = time === "YEARLY";

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
              <img alt="Sublr" src={`/logos/${isDesktop ? "imagotipo" : "isotipo"}.svg`} />
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
                isHiddenInMobile
              />
              <Filter label="Tags" isHiddenInMobile>
                <Autocomplete options={tagOptions} values={tags} setValues={setTags} />
              </Filter>
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
      </nav>
      <main className="container">
        <SummaryHeader
          subscriptions={subscriptions}
          time={time}
          currency={currency}
          primaryTotal={primaryTotal}
          secondaryTotal={secondaryTotal}
          primaryIsYearly={primaryIsYearly}
          uniqueCurrencies={uniqueCurrencies}
          summaryData={summaryData}
        />
        <SubscriptionList
          subscriptions={filteredSubscriptions}
          user={user}
          create={create}
          mutations={mutations}
        />
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
          filter: brightness(0) invert(1) drop-shadow(0 0 10px rgba(124, 255, 178, 0.35));
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
          box-shadow:
            0 -10px 15px 3px rgb(0 0 0 / 0.1),
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
