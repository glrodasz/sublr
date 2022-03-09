import {
  CREDIT_CARD_TYPES,
  TIME_DESCRIPTION,
  CURRENCY_TO_USD,
} from "./constants";

export const getCreditCardType = (type) => CREDIT_CARD_TYPES[type];
export const getTimeDescription = (time) => TIME_DESCRIPTION[time];

export const getUsdPrice = (price, currency) =>
  Number(CURRENCY_TO_USD[currency](price).toFixed(2));

export const getMonthlySubscriptionGrouppedByCard = (subscriptions) =>
  subscriptions.reduce((group, sub) => {
    const foreignKey = `${sub.creditCard.type}_${sub.creditCard.number}`;

    const monthlyPrice = sub.time === "MONTHLY" ? sub.price : sub.price / 12;

    if (group[foreignKey]) {
      group[foreignKey].price += getUsdPrice(monthlyPrice, sub.currency);
    } else {
      group[foreignKey] = {
        price: getUsdPrice(monthlyPrice, sub.currency),
        currency: "USD",
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
