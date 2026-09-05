import { useMemo, useState } from "react";
import { withOnboardingGuard } from "../features/onboarding/helpers/onboardingGuard";
import { PageLayout } from "../components/organisms/PageLayout";
import { ErrorState } from "../components/atoms/ErrorState";
import { ExpensesSummary } from "../features/expenses/components/ExpensesSummary";
import { ExpensesChart } from "../features/expenses/components/ExpensesChart";
import { CategoryBreakdown } from "../features/expenses/components/CategoryBreakdown";
import { useDomainTransactions } from "../hooks/useDomainTransactions";
import { PERIODS, getStartDate } from "../features/expenses/helpers/periods";
import { startOfPreviousMonth } from "../utils/startOfPreviousMonth";
import { toChartData } from "../features/expenses/helpers/chartData";
import { useCategories } from "../hooks/useCategories";
import { useRecurringItems } from "../hooks/useRecurringItems";
import { useMoneyContext } from "../hooks/useMoneyContext";
import { sumMonthly, computeMoM } from "../helpers";
import type { Currency } from "../types";

export const getServerSideProps = withOnboardingGuard();

function NewExpenseButton() {
  return (
    <button type="button" className="new-btn" disabled>
      + New expense
      <style jsx>{`
        .new-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--r-md);
          border: none;
          background: var(--fg-0);
          color: var(--bg-0);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .new-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}

export default function ExpensesPage() {
  const { ctx, target } = useMoneyContext();
  const currency: Currency = target;

  const [periodIdx, setPeriodIdx] = useState(0);
  const startDate = useMemo(() => getStartDate(PERIODS[periodIdx].months), [periodIdx]);
  // Fetch at least back to the 1st of last month so the MoM badge always
  // compares against a complete previous month, whatever period is displayed.
  const fetchStart = useMemo(() => {
    const momStart = startOfPreviousMonth();
    return startDate < momStart ? startDate : momStart;
  }, [startDate]);

  const {
    transactions: fetched,
    loading: txLoading,
    error: txError,
  } = useDomainTransactions("EXPENSE", fetchStart);
  const { items: recurringItems, error: itemsError } = useRecurringItems("EXPENSE");
  const { categories, loading: catLoading, error: catError } = useCategories("EXPENSE");
  const error = txError ?? itemsError ?? catError;

  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const selectedCatId = activeCatId ?? categories[0]?.id ?? null;

  const transactions = useMemo(
    () => fetched.filter((t) => t.occurredAt.toDate() >= startDate),
    [fetched, startDate]
  );
  const chartData = useMemo(() => toChartData(transactions), [transactions]);
  const momDelta = useMemo(
    () => computeMoM(fetched, { ...ctx, domain: "EXPENSE" }),
    [fetched, ctx]
  );
  const monthlyTotal = useMemo(() => sumMonthly(recurringItems, ctx), [recurringItems, ctx]);

  const filteredItems = useMemo(
    () => recurringItems.filter((i) => i.categoryId === selectedCatId),
    [recurringItems, selectedCatId]
  );
  const catTotal = useMemo(() => sumMonthly(filteredItems, ctx), [filteredItems, ctx]);

  return (
    <PageLayout title="Expenses" actions={<NewExpenseButton />}>
      {error && <ErrorState />}

      <ExpensesSummary
        total={monthlyTotal}
        currency={currency}
        deltaPct={momDelta.deltaPct}
        periodIdx={periodIdx}
        onPeriodChange={setPeriodIdx}
      />

      <ExpensesChart data={chartData} currency={currency} loading={txLoading} />

      <CategoryBreakdown
        categories={categories}
        items={filteredItems}
        selectedCategoryId={selectedCatId}
        categoryTotal={catTotal}
        currency={currency}
        loading={catLoading}
        onSelectCategory={setActiveCatId}
      />
    </PageLayout>
  );
}
