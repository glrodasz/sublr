export const shouldUpdateSubscriptionPrice = (subscription) => {
	if (subscription.price) {
	  return { price: Number(subscription.price) };
	} else {
	  return {};
	}
  };