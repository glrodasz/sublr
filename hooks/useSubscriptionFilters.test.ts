import { renderHook, act } from "@testing-library/react";
import useSubscriptionFilters from "./useSubscriptionFilters";
import type { Subscription } from "../types";

const subscriptions: Subscription[] = [
  {
    id: "a",
    title: "Zeta",
    price: 5,
    currency: "USD",
    time: "MONTHLY",
    tags: ["Domains"],
    creditCard: { type: "VISA", number: 1111 },
  },
  {
    id: "b",
    title: "Alpha",
    price: 100,
    currency: "USD",
    time: "YEARLY",
    tags: ["community"],
    creditCard: { type: "MASTERCARD", number: 2222 },
  },
];

describe("useSubscriptionFilters", () => {
  it("defaults to yearly/USD/price sort and exposes lowercased tag options", () => {
    const { result } = renderHook(() => useSubscriptionFilters(subscriptions, null));

    expect(result.current.time).toBe("YEARLY");
    expect(result.current.currency).toBe("USD");
    expect(result.current.sortBy).toBe("PRICE");
    expect(result.current.tagOptions.sort()).toEqual(["community", "domains"]);
  });

  it("sorts by name when sortBy is NAME", () => {
    const { result } = renderHook(() => useSubscriptionFilters(subscriptions, null));

    act(() => result.current.setSortBy("NAME"));

    expect(result.current.filteredSubscriptions.map((s) => s.title)).toEqual(["Alpha", "Zeta"]);
  });

  it("filters by selected card", () => {
    const { result } = renderHook(() => useSubscriptionFilters(subscriptions, null));

    act(() => result.current.setCard("VISA_1111"));

    expect(result.current.filteredSubscriptions).toHaveLength(1);
    expect(result.current.filteredSubscriptions[0].id).toBe("a");
  });

  it("filters by tags", () => {
    const { result } = renderHook(() => useSubscriptionFilters(subscriptions, null));

    act(() => result.current.setTags(["community"]));

    expect(result.current.filteredSubscriptions.map((s) => s.id)).toEqual(["b"]);
  });

  it("matches stored tags case-insensitively (legacy mixed-case data)", () => {
    const { result } = renderHook(() => useSubscriptionFilters(subscriptions, null));

    act(() => result.current.setTags(["domains"]));

    expect(result.current.filteredSubscriptions.map((s) => s.id)).toEqual(["a"]);
  });
});
