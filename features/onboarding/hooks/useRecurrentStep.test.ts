import { renderHook, act, waitFor } from "@testing-library/react";

const createMock = jest.fn();
const removeMock = jest.fn();
let itemsValue: {
  id?: string;
  categoryId: string;
  name: string;
  amount: number;
  frequency: string;
  paymentMethodId?: string;
}[] = [];
let loadingValue = false;

jest.mock("../../../hooks/useRecurrentTransactions", () => ({
  useRecurrentTransactions: () => ({
    items: itemsValue,
    loading: loadingValue,
    create: createMock,
    remove: removeMock,
  }),
}));

jest.mock("../../../hooks/useCategories", () => ({
  useCategories: () => ({
    categories: [{ id: "cat1", name: "Salary", domain: "INCOME" }],
    loading: false,
    error: null,
    create: jest.fn(),
    remove: jest.fn(),
  }),
}));

jest.mock("../../../hooks/usePaymentMethods", () => ({
  usePaymentMethods: () => ({
    methods: [{ id: "pm1", name: "Cash", type: "CASH" }],
    loading: false,
    create: jest.fn(),
    remove: jest.fn(),
  }),
}));

import { useRecurrentStep } from "./useRecurrentStep";

const fillValidRow = (result: { current: ReturnType<typeof useRecurrentStep> }) =>
  act(() =>
    result.current.update(result.current.rows[0].key, {
      categoryId: "cat1",
      name: "Monthly salary",
      amount: "5000",
    })
  );

beforeEach(() => {
  createMock.mockReset().mockResolvedValue("new-rt");
  removeMock.mockReset().mockResolvedValue(undefined);
  itemsValue = [];
  loadingValue = false;
});

describe("useRecurrentStep", () => {
  it("creates a row with the domain's default type", async () => {
    const { result } = renderHook(() => useRecurrentStep("INCOME", "USD"));

    fillValidRow(result);
    await act(async () => {
      expect(await result.current.save()).toBe(1);
    });

    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: "INCOME",
        categoryId: "cat1",
        name: "Monthly salary",
        amount: 5000,
        currency: "USD",
        type: "SALARY",
      })
    );
  });

  it("skips rows that are blank or only partially filled", async () => {
    const { result } = renderHook(() => useRecurrentStep("EXPENSE", "USD"));

    // Name and amount present, but no category picked.
    act(() => result.current.update(result.current.rows[0].key, { name: "Rent", amount: "1400" }));
    await act(async () => {
      expect(await result.current.save()).toBe(0);
    });

    // Category and name, but a non-positive amount.
    act(() =>
      result.current.update(result.current.rows[0].key, { categoryId: "cat1", amount: "0" })
    );
    await act(async () => {
      expect(await result.current.save()).toBe(0);
    });

    expect(createMock).not.toHaveBeenCalled();
  });

  it("deletes a saved row from Firestore, not just from local state", async () => {
    const { result } = renderHook(() => useRecurrentStep("INCOME", "USD"));

    fillValidRow(result);
    await act(async () => {
      await result.current.save();
    });
    const savedKey = result.current.rows[0].key;
    expect(result.current.rows[0].id).toBe("new-rt");

    act(() => result.current.removeAt(savedKey));

    // Without the API call the row would come back on the next visit.
    expect(removeMock).toHaveBeenCalledWith("new-rt");
    expect(result.current.rows.some((r) => r.key === savedKey)).toBe(false);
  });

  it("does not hit the API when removing a row that was never saved", () => {
    const { result } = renderHook(() => useRecurrentStep("INCOME", "USD"));

    act(() => result.current.add());
    const unsavedKey = result.current.rows[1].key;

    act(() => result.current.removeAt(unsavedKey));

    expect(removeMock).not.toHaveBeenCalled();
    expect(result.current.rows.some((r) => r.key === unsavedKey)).toBe(false);
  });

  it("hydrates from already-saved transactions", async () => {
    loadingValue = true;
    const { result, rerender } = renderHook(() => useRecurrentStep("INCOME", "USD"));
    expect(result.current.rows).toHaveLength(1);

    itemsValue = [
      {
        id: "rt1",
        categoryId: "cat1",
        name: "Freelance",
        amount: 1200,
        frequency: "MONTHLY",
        paymentMethodId: "pm1",
      },
    ];
    loadingValue = false;
    rerender();

    await waitFor(() => expect(result.current.rows[0].name).toBe("Freelance"));
    expect(result.current.rows[0].id).toBe("rt1");
    // Amounts round-trip through a string, since the input is text.
    expect(result.current.rows[0].amount).toBe("1200");
    expect(result.current.rows[0].paymentMethodId).toBe("pm1");
  });
});
