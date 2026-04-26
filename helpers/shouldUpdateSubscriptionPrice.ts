interface SubscriptionPriceInput {
  price?: number | string;
}

export const shouldUpdateSubscriptionPrice = (
  subscription: SubscriptionPriceInput
): { price: number } | Record<string, never> => {
  if (subscription.price) {
    return { price: Number(subscription.price) };
  } else {
    return {};
  }
};
