import { useMemo } from "react";
import type { Currency, ExchangeRates, Subscription, TimeAttribute } from "../types";
import { getMonthlySubscriptionGroupedByCard, getSummaryData, getSummaryTotal } from "../helpers";

interface UseSummaryResult {
  cards: string[];
  summaryData: ReturnType<typeof getSummaryData>;
  uniqueCurrencies: number;
  primaryTotal: number;
  secondaryTotal: number;
  primaryIsYearly: boolean;
}

export const useSummary = (
  subscriptions: Subscription[],
  currency: Currency,
  time: TimeAttribute,
  rates: ExchangeRates | null
): UseSummaryResult => {
  const grouped = useMemo(
    () => getMonthlySubscriptionGroupedByCard(subscriptions, currency, rates),
    [subscriptions, currency, rates]
  );
  const cards = useMemo(() => Object.keys(grouped), [grouped]);
  const summaryData = useMemo(() => getSummaryData(grouped), [grouped]);
  const summaryTotal = useMemo(() => getSummaryTotal(summaryData), [summaryData]);
  const uniqueCurrencies = useMemo(
    () => new Set(subscriptions.map((s) => s.currency)).size,
    [subscriptions]
  );

  const primaryIsYearly = time === "YEARLY";

  return {
    cards,
    summaryData,
    uniqueCurrencies,
    primaryTotal: primaryIsYearly ? summaryTotal.yearly : summaryTotal.monthly,
    secondaryTotal: primaryIsYearly ? summaryTotal.monthly : summaryTotal.yearly,
    primaryIsYearly,
  };
};
