import type { CreditCard } from "../types";

interface PartialSubscriptionInput {
  creditCardType?: string;
  creditCardNumber?: number | string;
}

interface CreditCardResult {
  creditCard: Partial<CreditCard>;
}

export const getCreditCardInfoFromCurrentSubscription = (
  subscription: PartialSubscriptionInput
): CreditCardResult | undefined => {
  const type = subscription.creditCardType;
  const number = subscription.creditCardNumber;

  if (type && number) {
    return { creditCard: { type, number } };
  }
  if (type) {
    return { creditCard: { type } };
  }
  if (number) {
    return { creditCard: { number } };
  }
};
