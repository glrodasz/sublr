import { useMemo, useState } from "react";
import { withOnboardingGuard } from "../features/onboarding/helpers/onboardingGuard";
import { PageLayout } from "../components/organisms/PageLayout";
import { ExpensesSummary } from "../features/expenses/components/ExpensesSummary";
import { ExpensesChart } from "../features/expenses/components/ExpensesChart";
import { CategoryBreakdown } from "../features/expenses/components/CategoryBreakdown";
import { useDomainTransactions } from "../features/expenses/hooks/useDomainTransactions";
import { PERIODS, getStartDate } from "../features/expenses/helpers/periods";
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

  const { transactions, loading: txLoading } = useDomainTransactions("EXPENSE", startDate);
  const { items: recurringItems } = useRecurringItems("EXPENSE");
  const { categories, loading: catLoading } = useCategories("EXPENSE");

  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const selectedCatId = activeCatId ?? categories[0]?.id ?? null;

  const chartData = useMemo(() => toChartData(transactions), [transactions]);
  const momDelta = useMemo(
    () => computeMoM(transactions, { ...ctx, domain: "EXPENSE" }),
    [transactions, ctx]
  );
  const monthlyTotal = useMemo(() => sumMonthly(recurringItems, ctx), [recurringItems, ctx]);

  const filteredItems = useMemo(
    () => recurringItems.filter((i) => i.categoryId === selectedCatId),
    [recurringItems, selectedCatId]
  );
  const catTotal = useMemo(() => sumMonthly(filteredItems, ctx), [filteredItems, ctx]);

  return (
    <PageLayout title="Expenses" actions={<NewExpenseButton />}>
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
