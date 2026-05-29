import { useUser } from "@auth0/nextjs-auth0/client";
import auth0 from "../lib/auth0";
import { PageLayout } from "../components/organisms/PageLayout";
import { StatCard } from "../components/molecules/StatCard";
import { ExpenseBreakdown } from "../components/organisms/ExpenseBreakdown";
import { RecentPayments } from "../components/organisms/RecentPayments";
import { UpcomingExpirations } from "../components/organisms/UpcomingExpirations";
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

  const actions = (
    <>
      <button type="button" className="btn" disabled>
        + New income
      </button>
      <button type="button" className="btn" disabled>
        + New expense
      </button>
      <style jsx>{`
        .btn {
          padding: 8px 14px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--line-strong);
          background: var(--bg-1);
          color: var(--fg-1);
          white-space: nowrap;
        }

        .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );

  return (
    <PageLayout title={`Welcome back, ${firstName}`} currency={currency} actions={actions}>
      <section className="row">
        {userDoc ? (
          <>
            <StatCard title="Income" amount={totals.income} currency={currency} domain="INCOME" />
            <StatCard
              title="Expenses"
              amount={totals.expense}
              currency={currency}
              domain="EXPENSE"
              delta={momDelta.deltaPct}
            />
            <StatCard
              title="Investments"
              amount={totals.investment}
              currency={currency}
              domain="INVESTMENT"
            />
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

      <style jsx>{`
        .row {
          display: flex;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .row {
            flex-direction: column;
          }
        }
      `}</style>
    </PageLayout>
  );
}
