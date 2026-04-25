import type { SummaryEntry, SummaryTotal } from "../types";

export const getSummaryTotal = (summaryData: SummaryEntry[]): SummaryTotal =>
  summaryData.reduce(
    (total, data) => {
      total.monthly = total.monthly + data.monthly.price;
      total.yearly = total.yearly + data.yearly.price;
      return total;
    },
    { monthly: 0, yearly: 0 }
  );
