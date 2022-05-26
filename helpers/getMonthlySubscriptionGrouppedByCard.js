import { getUsdPrice } from './getUsdPrice'

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