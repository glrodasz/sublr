import type { Currency, ExchangeRates, GroupedByCard, Subscription } from "../types";
import { getUsdPrice } from "./getUsdPrice";

export const getMonthlySubscriptionGroupedByCard = (
  subscriptions: Subscription[],
  currency: Currency | undefined,
  rates?: ExchangeRates | null
): GroupedByCard =>
  subscriptions.reduce<GroupedByCard>((group, sub) => {
    const foreignKey = `${sub.creditCard?.type}_${sub.creditCard?.number}`;
    const monthlyPrice = sub.time === "MONTHLY" ? sub.price : sub.price / 12;
    const usdPrice = getUsdPrice(monthlyPrice, sub.currency, rates);
    const price = currency === "USD" ? usdPrice : usdPrice * (rates?.[currency as Currency] ?? 1);

    if (group[foreignKey]) {
      group[foreignKey].price += price;
    } else {
      group[foreignKey] = { price, currency };
    }

    return group;
  }, {});
