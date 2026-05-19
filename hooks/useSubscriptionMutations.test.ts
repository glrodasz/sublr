import { renderHook, act } from "@testing-library/react";
import useSubscriptionMutations from "./useSubscriptionMutations";

describe("useSubscriptionMutations", () => {
  it("accumulates pending changes and truncates a card number to its last 4 digits", () => {
    const remove = jest.fn().mockResolvedValue(undefined);
    const update = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSubscriptionMutations(remove, update));

    act(() => result.current.handleChange("sub1", { id: "title", value: "Netflix" }));
    act(() =>
      result.current.handleChange("sub1", { id: "creditCardNumber", value: "4111111111111234" })
    );

    expect(result.current.changedSubscriptions.sub1).toEqual({
      title: "Netflix",
      creditCardNumber: "1234",
    });
  });

  it("removes the selected subscription on confirm", () => {
    const remove = jest.fn().mockResolvedValue(undefined);
    const update = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSubscriptionMutations(remove, update));

    act(() => result.current.handleRemove("sub1"));
    act(() => result.current.handleConfirmDelete());

    expect(remove).toHaveBeenCalledWith("sub1");
  });

  it("updates with coerced price and credit card info on confirm", () => {
    const remove = jest.fn().mockResolvedValue(undefined);
    const update = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useSubscriptionMutations(remove, update));

    act(() => result.current.handleChange("sub1", { id: "price", value: "9.99" }));
    act(() => result.current.handleChange("sub1", { id: "creditCardType", value: "VISA" }));
    act(() => result.current.handleUpdate("sub1"));
    act(() => result.current.handleConfirmUpdate());

    expect(update).toHaveBeenCalledWith(
      "sub1",
      expect.objectContaining({ price: 9.99, creditCard: { type: "VISA" } })
    );
    expect(result.current.updatedSubscriptions.sub1).toBe(1);
  });
});
