import {
  getCreditCardType,
  getTimeDescription,
  getUsdPrice,
  getMonthlySubscriptionGrouppedByCard,
} from ".";

jest.mock("../constants", () => {
  return {
    CREDIT_CARD_TYPES: {
      VISA: "foo",
    },
    TIME_DESCRIPTION: {
      MONTHLY: "bar",
    }
  };
});

describe("[ helpers ]", () => {
  describe("#getCreditCardType", () => {
    describe("when type is `VISA`", () => {
      it("should return `foo`", () => {
        // Arrange
        const type = "VISA";
        const expected = "foo";

        // Act
        const result = getCreditCardType(type);

        // Assert
        expect(result).toBe(expected);
      });
    });
  });

  describe("#getTimeDescription", () => {
    describe("when time is `MONTHLY`", () => {
      it("should return `bar`", () => {
        // Arrange
        const time = "MONTHLY";
        const expected = "bar";

        // Act
        const result = getTimeDescription(time);

        // Assert
        expect(result).toBe(expected);
      });
    });
  });

  describe("#getUsdPrice", () => {
    describe("when currency is in `COP`", () => {
      it("should return the price in `USD`", () => {
        // Arrange
        const price = 7000;
        const currency = "COP";
        const expected = 2.33;
        const rates = {
          COP: 2999
        }

        // Act
        const result = getUsdPrice(price, currency, rates);

        // Assert
        expect(result).toBe(expected);
      });
    });
  });

  describe.skip("#getMonthlySubscriptionGrouppedByCard", () => {
    describe("when `subscriptions` is provided", () => {
      it("should return it groupped by cards", () => {
        // Arrange
        const subscriptions = [
          {
            price: 9.99,
            currency: "USD",
            time: "MONTHLY",
            creditCard: {
              type: "MASTERCARD",
              number: 1654,
            },
          },
		  {
            price: 0.01,
            currency: "USD",
            time: "MONTHLY",
            creditCard: {
              type: "MASTERCARD",
              number: 1654,
            },
          },
          {
            price: 99.99,
            currency: "USD",
            time: "YEARLY",
            creditCard: {
              type: "MASTERCARD",
              number: 9387,
            },
          },
        ];
        const expected = {
          MASTERCARD_1654: {
            price: 10,
            currency: "USD",
          },
          MASTERCARD_9387: {
            price: 8.33,
            currency: "USD",
          },
        };

        // Act
        const result = getMonthlySubscriptionGrouppedByCard(subscriptions);

        // Assert
        expect(result).toStrictEqual(expected);
      });
    });
  });
});
