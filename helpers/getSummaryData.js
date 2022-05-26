export const getSummaryData = (grouppedMonthlySubscriptions) =>
  Object.keys(grouppedMonthlySubscriptions).map((key) => {
    const [type, number] = key.split("_");
    const { price: monthlyPrice, currency } = grouppedMonthlySubscriptions[key];

    return {
      key,
      creditCard: {
        type,
        number,
      },
      // TODO: Change this to support all currencies at the time
      monthly: { price: monthlyPrice, currency },
      yearly: { price: monthlyPrice * 12, currency },
    };
  });