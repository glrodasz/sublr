export const getSummaryTotal = (summaryData) =>
  summaryData.reduce(
    (total, data) => {
      total.monthly = total.monthly + data.monthly.price;
      total.yearly = total.yearly + data.yearly.price;

      return total;
    },
    { monthly: 0, yearly: 0 }
  );
