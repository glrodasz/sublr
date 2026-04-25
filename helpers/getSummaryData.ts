import type { GroupedByCard, SummaryEntry } from "../types";

export const getSummaryData = (groupedMonthlySubscriptions: GroupedByCard): SummaryEntry[] =>
  Object.keys(groupedMonthlySubscriptions).map((key) => {
    const [type, number] = key.split("_");
    const { price: monthlyPrice, currency } = groupedMonthlySubscriptions[key];

    return {
      key,
      creditCard: { type, number },
      monthly: { price: monthlyPrice, currency },
      yearly: { price: monthlyPrice * 12, currency },
    };
  });
