import Head from "next/head";
import { useUser } from "@auth0/nextjs-auth0/client";
import auth0 from "../lib/auth0";
import { Sidebar } from "../components/layout/Sidebar";
import { TotalCard } from "../components/dashboard/TotalCard";
import { ExpenseBreakdown } from "../components/dashboard/ExpenseBreakdown";
import { RecentPayments } from "../components/dashboard/RecentPayments";
import { UpcomingExpirations } from "../components/dashboard/UpcomingExpirations";
import Skeleton from "../components/Skeleton";
import { useDashboard } from "../hooks/useDashboard";
import { useUserDoc } from "../hooks/useUserDoc";
import type { Currency } from "../types";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function Dashboard() {
  const { user } = useUser();
  const userDoc = useUserDoc();
  const { totals, expensesByCategory, recentPayments, upcoming, momDelta } = useDashboard();

  const currency: Currency = userDoc?.mainCurrency ?? "USD";
  const firstName = (user?.name ?? user?.nickname ?? "there").split(" ")[0];

  return (
    <>
      <Head>
        <title>Dashboard — Waletto</title>
        <meta name="theme-color" content="#0A0A0F" />
      </Head>

      <div className="app">
        <Sidebar />

        <div className="content">
          <header className="header">
            <div className="header-left">
              <h1 className="welcome">Welcome back, {firstName}</h1>
              <span className="currency-badge">{currency}</span>
            </div>
            <div className="header-actions">
              <button type="button" className="btn btn--ghost" disabled>
                + New income
              </button>
              <button type="button" className="btn btn--ghost" disabled>
                + New expense
              </button>
            </div>
          </header>

          <main className="main">
            <section className="row">
              {userDoc ? (
                <>
                  <TotalCard title="Income" amount={totals.income} currency={currency} />
                  <TotalCard
                    title="Expenses"
                    amount={totals.expense}
                    currency={currency}
                    delta={momDelta.deltaPct}
                  />
                  <TotalCard title="Investments" amount={totals.investment} currency={currency} />
                </>
              ) : (
                <>
                  <Skeleton.Box width="100%" height={120} />
                  <Skeleton.Box width="100%" height={120} />
                  <Skeleton.Box width="100%" height={120} />
                </>
              )}
            </section>

            <section className="row">
              <ExpenseBreakdown rows={expensesByCategory} currency={currency} />
              <RecentPayments transactions={recentPayments} />
              <UpcomingExpirations items={upcoming} />
            </section>
          </main>
        </div>
      </div>

      <style jsx>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: var(--bg-0, #0a0a0f);
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid var(--line, #2a2a38);
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .welcome {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--fg-0, #f0f0f5);
        }

        .currency-badge {
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--bg-2, #1e1e2e);
          color: var(--fg-2, #7a7a9a);
          border: 1px solid var(--line, #2a2a38);
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--line-strong, #3a3a4d);
          background: var(--bg-1, #14141b);
          color: var(--fg-1, #b8b8c8);
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .main {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .row {
          display: flex;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .app {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .row {
            flex-direction: column;
          }

          .main {
            padding: 20px 16px;
          }

          .header {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
