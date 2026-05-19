import { renderHook } from "@testing-library/react";
import { useSummary } from "./useSummary";
import type { Subscription } from "../types";

const subscriptions: Subscription[] = [
  {
    price: 9.99,
    currency: "USD",
    time: "MONTHLY",
    creditCard: { type: "MASTERCARD", number: 1654 },
  },
  { price: 120, currency: "USD", time: "YEARLY", creditCard: { type: "VISA", number: 9387 } },
];

describe("useSummary", () => {
  it("derives cards, totals and unique currency count", () => {
    const { result } = renderHook(() => useSummary(subscriptions, "USD", "YEARLY", null));

    expect(result.current.cards).toEqual(["MASTERCARD_1654", "VISA_9387"]);
    expect(result.current.uniqueCurrencies).toBe(1);
    expect(result.current.primaryIsYearly).toBe(true);
    // 9.99/mo -> 119.88/yr  + 120/yr = 239.88
    expect(result.current.primaryTotal).toBeCloseTo(239.88, 2);
    expect(result.current.secondaryTotal).toBeCloseTo(19.99, 2);
  });

  it("swaps primary/secondary totals when monthly", () => {
    const { result } = renderHook(() => useSummary(subscriptions, "USD", "MONTHLY", null));

    expect(result.current.primaryIsYearly).toBe(false);
    expect(result.current.primaryTotal).toBeCloseTo(19.99, 2);
  });
});
