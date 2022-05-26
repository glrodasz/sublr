export const getCreditCardInfoFromCurrentSubscription = (subscription) => {
  const type = subscription.creditCardType;
  const number = subscription.creditCardNumber;

  if (type && number) {
    return {
      creditCard: {
        type,
        number,
      },
    };
  }

  if (type) {
    return {
      creditCard: {
        type,
      },
    };
  }

  if (number) {
    return {
      creditCard: {
        number,
      },
    };
  }
};
