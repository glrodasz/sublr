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
  const { totals, expensesByCategory, recentPayments, upcoming, momDelta, loading } = useDashboard();

  const currency: Currency = userDoc?.mainCurrency ?? "USD";
  const firstName = (user?.name ?? user?.nickname ?? "there").split(" ")[0];

  return (
    <>
      <Head>
        <title>Dashboard — Waletto</title>
        <meta name="theme-color" content="#0A0A0F" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
              <button type="button" className="btn" disabled>
                + New income
              </button>
              <button type="button" className="btn" disabled>
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
              <ExpenseBreakdown rows={expensesByCategory} currency={currency} loading={loading} />
              <RecentPayments transactions={recentPayments} loading={loading} />
              <UpcomingExpirations items={upcoming} loading={loading} />
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
          padding: 20px 28px;
          border-bottom: 1px solid var(--line, #2a2a38);
          gap: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .welcome {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--fg-0, #f0f0f5);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .currency-badge {
          flex-shrink: 0;
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
          flex-shrink: 0;
        }

        .btn {
          padding: 8px 14px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--line-strong, #3a3a4d);
          background: var(--bg-1, #14141b);
          color: var(--fg-1, #b8b8c8);
          white-space: nowrap;
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .main {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .row {
          display: flex;
          gap: 16px;
        }

        /* Tablet: stack cards at ≤900px while sidebar is still visible */
        @media (max-width: 900px) {
          .row {
            flex-direction: column;
          }
        }

        /* Mobile: bottom nav is present, sidebar is hidden */
        @media (max-width: 767px) {
          .header {
            padding: 14px 16px;
          }

          .welcome {
            font-size: 1rem;
          }

          /* Hide action buttons on mobile — disabled anyway, clutters small screens */
          .header-actions {
            display: none;
          }

          .main {
            padding: 16px 16px;
            /* leave room for the fixed bottom nav */
            padding-bottom: 80px;
          }
        }
      `}</style>
    </>
  );
}
