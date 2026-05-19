import type { Subscription } from "../types";
import {
  currencyToUsd,
  getCreditCardIconName,
  getCreditCardInfoFromCurrentSubscription,
  getSummaryData,
  getSummaryTotal,
  needsExchangeRates,
  shouldUpdateSubscriptionPrice,
  getUsdPrice,
  getMonthlySubscriptionGroupedByCard,
} from ".";

describe("[ helpers coverage ]", () => {
  describe("#currencyToUsd", () => {
    it("returns the price unchanged for USD", () => {
      expect(currencyToUsd(null).USD(10)).toBe(10);
    });

    it("divides by the rate for a foreign currency", () => {
      expect(currencyToUsd({ COP: 4000 }).COP(8000)).toBe(2);
    });

    it("falls back to 1 when the rate is missing", () => {
      expect(currencyToUsd(null).EUR(5)).toBe(5);
      expect(currencyToUsd(null).COP(5)).toBe(5);
      expect(currencyToUsd(undefined).SEK(5)).toBe(5);
    });

    it("divides by SEK rate when provided", () => {
      expect(currencyToUsd({ SEK: 10 }).SEK(100)).toBe(10);
    });
  });

  describe("#getUsdPrice", () => {
    it("rounds to two decimals", () => {
      expect(getUsdPrice(7000, "COP", { COP: 2999 })).toBe(2.33);
    });
  });

  describe("#getCreditCardIconName", () => {
    it("lowercases the resolved card type", () => {
      expect(getCreditCardIconName("VISA")).toBe("visa");
      expect(getCreditCardIconName("MASTERCARD")).toBe("mastercard");
    });
  });

  describe("#getCreditCardInfoFromCurrentSubscription", () => {
    it("returns type and number when both present", () => {
      expect(
        getCreditCardInfoFromCurrentSubscription({
          creditCardType: "VISA",
          creditCardNumber: 1234,
        })
      ).toEqual({ creditCard: { type: "VISA", number: 1234 } });
    });

    it("returns only type when number is absent", () => {
      expect(getCreditCardInfoFromCurrentSubscription({ creditCardType: "VISA" })).toEqual({
        creditCard: { type: "VISA" },
      });
    });

    it("returns only number when type is absent", () => {
      expect(getCreditCardInfoFromCurrentSubscription({ creditCardNumber: 9999 })).toEqual({
        creditCard: { number: 9999 },
      });
    });

    it("returns undefined when nothing is provided", () => {
      expect(getCreditCardInfoFromCurrentSubscription({})).toBeUndefined();
    });
  });

  describe("#shouldUpdateSubscriptionPrice", () => {
    it("coerces a truthy price to a number", () => {
      expect(shouldUpdateSubscriptionPrice({ price: "12.5" })).toEqual({ price: 12.5 });
    });

    it("returns an empty object when price is falsy", () => {
      expect(shouldUpdateSubscriptionPrice({})).toEqual({});
      expect(shouldUpdateSubscriptionPrice({ price: 0 })).toEqual({});
    });
  });

  describe("#needsExchangeRates", () => {
    it("is false when every subscription is USD", () => {
      const subs: Subscription[] = [{ price: 1, currency: "USD", time: "MONTHLY" }];
      expect(needsExchangeRates(subs)).toBe(false);
    });

    it("is true when any subscription is non-USD", () => {
      const subs: Subscription[] = [
        { price: 1, currency: "USD", time: "MONTHLY" },
        { price: 1, currency: "COP", time: "YEARLY" },
      ];
      expect(needsExchangeRates(subs)).toBe(true);
    });
  });

  describe("#getSummaryData / #getSummaryTotal", () => {
    it("expands grouped cards and totals them", () => {
      const grouped = {
        MASTERCARD_1654: { price: 10, currency: "USD" as const },
        VISA_9387: { price: 5, currency: "USD" as const },
      };
      const data = getSummaryData(grouped);

      expect(data).toEqual([
        {
          key: "MASTERCARD_1654",
          creditCard: { type: "MASTERCARD", number: "1654" },
          monthly: { price: 10, currency: "USD" },
          yearly: { price: 120, currency: "USD" },
        },
        {
          key: "VISA_9387",
          creditCard: { type: "VISA", number: "9387" },
          monthly: { price: 5, currency: "USD" },
          yearly: { price: 60, currency: "USD" },
        },
      ]);

      expect(getSummaryTotal(data)).toEqual({ monthly: 15, yearly: 180 });
    });
  });

  describe("#getMonthlySubscriptionGroupedByCard (display currency)", () => {
    it("converts the USD subtotal into a non-USD display currency", () => {
      const subs: Subscription[] = [
        { price: 10, currency: "USD", time: "MONTHLY", creditCard: { type: "VISA", number: 1 } },
      ];

      const grouped = getMonthlySubscriptionGroupedByCard(subs, "COP", { COP: 4000 });

      expect(grouped.VISA_1.price).toBe(40000);
      expect(grouped.VISA_1.currency).toBe("COP");
    });

    it("falls back to a 1:1 rate when the display rate is missing", () => {
      const subs: Subscription[] = [
        { price: 10, currency: "USD", time: "YEARLY", creditCard: { type: "VISA", number: 2 } },
      ];

      const grouped = getMonthlySubscriptionGroupedByCard(subs, "EUR", null);

      // 10 / 12 monthly, no rate -> unchanged
      expect(grouped.VISA_2.price).toBeCloseTo(0.83, 2);
    });
  });
});
