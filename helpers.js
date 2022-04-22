import { CREDIT_CARD_TYPES, TIME_DESCRIPTION } from "./constants";

export const getCreditCardType = (type) => CREDIT_CARD_TYPES[type];
export const getTimeDescription = (time) => TIME_DESCRIPTION[time];

export const currencyToUsd = (rates) => ({
  USD: (price) => price,
  COP: (price) => price / rates?.COP ?? 1,
  SEK: (price) => price / rates?.SEK ?? 1,
  EUR: (price) => price / rates?.EUR ?? 1,
});

export const getUsdPrice = (price, currency, rates) =>
  Number(currencyToUsd(rates)[currency](price).toFixed(2));

export const getMonthlySubscriptionGrouppedByCard = (
  subscriptions,
  currency,
  rates
) =>
  subscriptions.reduce((group, sub) => {
    const foreignKey = `${sub.creditCard.type}_${sub.creditCard.number}`;

    const monthlyPrice = sub.time === "MONTHLY" ? sub.price : sub.price / 12;

    const usdPrice = getUsdPrice(monthlyPrice, sub.currency, rates);
    const price = currency === "USD" ? usdPrice : usdPrice * (rates?.[currency] ?? 1);

    if (group[foreignKey]) {
      group[foreignKey].price += price;
    } else {
      group[foreignKey] = {
        price,
        currency,
      };
    }

    return group;
  }, {});

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
