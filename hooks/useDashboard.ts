import { useMemo } from "react";
import { useRecurringItems } from "./useRecurringItems";
import { useRecentTransactions } from "./useRecentTransactions";
import { useUpcomingItems } from "./useUpcomingItems";
import { useCategories } from "./useCategories";
import { sumMonthly, groupByCategory, computeMoM } from "../helpers";

export function useDashboard() {
  const { items: incomes } = useRecurringItems("INCOME");
  const { items: expenses } = useRecurringItems("EXPENSE");
  const { items: investments } = useRecurringItems("INVESTMENT");
  const { categories } = useCategories();
  const { transactions } = useRecentTransactions(30);
  const { items: upcoming } = useUpcomingItems(5);

  const totals = useMemo(
    () => ({
      income: sumMonthly(incomes),
      expense: sumMonthly(expenses),
      investment: sumMonthly(investments),
    }),
    [incomes, expenses, investments]
  );

  const expensesByCategory = useMemo(() => {
    const grouped = groupByCategory(expenses);
    const total = Object.values(grouped).reduce((a, b) => a + b, 0);
    return Object.entries(grouped)
      .map(([categoryId, amount]) => ({
        categoryId,
        name: categories.find((c) => c.id === categoryId)?.name ?? "Unknown",
        amount,
        percent: total === 0 ? 0 : (amount / total) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, categories]);

  const momDelta = useMemo(() => computeMoM(transactions), [transactions]);

  return {
    totals,
    expensesByCategory,
    recentPayments: transactions.slice(0, 5),
    upcoming,
    momDelta,
  };
}
