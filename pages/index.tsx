import { useUser } from "@auth0/nextjs-auth0/client";
import { withOnboardingGuard } from "../features/onboarding/helpers/onboardingGuard";
import { PageLayout } from "../components/organisms/PageLayout";
import { StatCard } from "../components/molecules/StatCard";
import { ExpenseBreakdown } from "../features/dashboard/components/ExpenseBreakdown";
import { RecentPayments } from "../features/dashboard/components/RecentPayments";
import { UpcomingExpirations } from "../features/dashboard/components/UpcomingExpirations";
import Skeleton from "../components/Skeleton";
import { CurrencySelector } from "../features/dashboard/components/CurrencySelector";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import { useUserDoc } from "../hooks/useUserDoc";

export const getServerSideProps = withOnboardingGuard();

export default function Dashboard() {
  const { user } = useUser();
  const { userDoc } = useUserDoc();
  const {
    currency,
    setDisplayCurrency,
    totals,
    expensesByCategory,
    incomesByCategory,
    investmentsByCategory,
    recentPayments,
    upcoming,
    momDelta,
    loading,
  } = useDashboard();

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
    <PageLayout
      title={`Welcome back, ${firstName}`}
      currency={currency}
      currencyControl={<CurrencySelector value={currency} onChange={setDisplayCurrency} />}
      actions={actions}
    >
      <section className="row">
        {userDoc ? (
          <>
            <StatCard
              title="Income"
              amount={totals.income}
              currency={currency}
              domain="INCOME"
              summary={incomesByCategory.slice(0, 2)}
            />
            <StatCard
              title="Expenses"
              amount={totals.expense}
              currency={currency}
              domain="EXPENSE"
              delta={momDelta.deltaPct}
              summary={expensesByCategory.slice(0, 2)}
            />
            <StatCard
              title="Investments"
              amount={totals.investment}
              currency={currency}
              domain="INVESTMENT"
              summary={investmentsByCategory.slice(0, 2)}
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
