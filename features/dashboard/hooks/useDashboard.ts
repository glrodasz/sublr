import { useMemo } from "react";
import { useRecurringItems } from "../../../hooks/useRecurringItems";
import { useRecentTransactions } from "./useRecentTransactions";
import { useUpcomingItems } from "./useUpcomingItems";
import { useCategories } from "../../../hooks/useCategories";
import { useMoneyContext } from "../../../hooks/useMoneyContext";
import { groupByCategory, computeMoM, computeFlow } from "../../../helpers";
import type { MoneyContext } from "../../../helpers";

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
  const { items: incomes, loading: l1 } = useRecurringItems("INCOME");
  const { items: expenses, loading: l2 } = useRecurringItems("EXPENSE");
  const { items: investments, loading: l3 } = useRecurringItems("INVESTMENT");
  const { items: savings, loading: l7 } = useRecurringItems("SAVING");
  const { categories, loading: l4 } = useCategories();
  const { transactions, loading: l5 } = useRecentTransactions(30);
  const { items: upcoming, loading: l6 } = useUpcomingItems(5);
  const { ctx, target, fxStale, fxMissing, setDisplayCurrency } = useMoneyContext();
  const loading = l1 || l2 || l3 || l4 || l5 || l6 || l7;

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
    () => computeMoM(transactions, { ...ctx, domain: "EXPENSE" }),
    [transactions, ctx]
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
    recentPayments: transactions.slice(0, 5),
    upcoming,
    momDelta,
    loading,
  };
}
