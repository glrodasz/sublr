import { useMemo } from "react";
import { useRecurringItems } from "../../../hooks/useRecurringItems";
import { useDomainTransactions } from "../../../hooks/useDomainTransactions";
import { useRecentTransactions } from "./useRecentTransactions";
import { useUpcomingItems } from "./useUpcomingItems";
import { useCategories } from "../../../hooks/useCategories";
import { useMoneyContext } from "../../../hooks/useMoneyContext";
import { groupByCategory, computeMoM, computeFlow } from "../../../helpers";
import type { MoneyContext } from "../../../helpers";
import { startOfPreviousMonth } from "../../../utils/startOfPreviousMonth";

function buildCategoryList(
  items: ReturnType<typeof useRecurringItems>["items"],
  categories: ReturnType<typeof useCategories>["categories"],
  ctx: MoneyContext
) {
  const grouped = groupByCategory(items, ctx);
  const total = Object.values(grouped).reduce((a, b) => a + b, 0);
  return Object.entries(grouped)
    .map(([categoryId, amount]) => ({
      categoryId,
      name: categories.find((c) => c.id === categoryId)?.name ?? "Unknown",
      amount,
      percent: total === 0 ? 0 : (amount / total) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function useDashboard() {
  const { items: incomes, loading: l1, error: e1 } = useRecurringItems("INCOME");
  const { items: expenses, loading: l2, error: e2 } = useRecurringItems("EXPENSE");
  const { items: investments, loading: l3, error: e3 } = useRecurringItems("INVESTMENT");
  const { items: savings, loading: l7, error: e7 } = useRecurringItems("SAVING");
  const { categories, loading: l4, error: e4 } = useCategories();
  const { transactions: recentPayments, loading: l5, error: e5 } = useRecentTransactions(5);
  const { items: upcoming, loading: l6, error: e6 } = useUpcomingItems(5);
  // The MoM delta needs every EXPENSE doc since the 1st of last month — a
  // capped recent-payments query would truncate the previous month and mix
  // domains into the comparison.
  const momStart = useMemo(() => startOfPreviousMonth(), []);
  const {
    transactions: expenseTransactions,
    loading: l8,
    error: e8,
  } = useDomainTransactions("EXPENSE", momStart);
  const { ctx, target, fxStale, fxMissing, setDisplayCurrency } = useMoneyContext();
  const loading = l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8;
  const error = e1 ?? e2 ?? e3 ?? e4 ?? e5 ?? e6 ?? e7 ?? e8;

  const flow = useMemo(
    () =>
      computeFlow(
        { INCOME: incomes, EXPENSE: expenses, INVESTMENT: investments, SAVING: savings },
        ctx
      ),
    [incomes, expenses, investments, savings, ctx]
  );

  const totals = useMemo(
    () => ({
      income: flow.income,
      expense: flow.expenses,
      investment: flow.investments,
      saving: flow.savings,
    }),
    [flow]
  );

  const expensesByCategory = useMemo(
    () => buildCategoryList(expenses, categories, ctx),
    [expenses, categories, ctx]
  );

  const incomesByCategory = useMemo(
    () => buildCategoryList(incomes, categories, ctx),
    [incomes, categories, ctx]
  );

  const investmentsByCategory = useMemo(
    () => buildCategoryList(investments, categories, ctx),
    [investments, categories, ctx]
  );

  const savingsByCategory = useMemo(
    () => buildCategoryList(savings, categories, ctx),
    [savings, categories, ctx]
  );

  const momDelta = useMemo(
    () => computeMoM(expenseTransactions, { ...ctx, domain: "EXPENSE" }),
    [expenseTransactions, ctx]
  );

  return {
    currency: target,
    fxStale,
    fxMissing,
    setDisplayCurrency,
    totals,
    flow,
    expensesByCategory,
    incomesByCategory,
    investmentsByCategory,
    savingsByCategory,
    recentPayments,
    upcoming,
    momDelta,
    loading,
    error,
  };
}
