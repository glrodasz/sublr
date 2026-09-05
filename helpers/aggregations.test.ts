import { toMonthlyAmount, sumMonthly, groupByCategory, computeMoM } from "./aggregations";
import type { RecurringItem, Transaction, Timestamp } from "../types";

const makeItem = (
  frequency: RecurringItem["frequency"],
  amount: number,
  categoryId = "cat1"
): RecurringItem => ({
  userId: "u1",
  domain: "EXPENSE",
  categoryId,
  name: "Test",
  amount,
  currency: "USD",
  frequency,
  active: true,
  startDate: { seconds: 0, nanoseconds: 0, toDate: () => new Date(0) } as Timestamp,
});

const makeTransaction = (amount: number, date: Date): Transaction => ({
  userId: "u1",
  domain: "EXPENSE",
  categoryId: "cat1",
  name: "T",
  amount,
  currency: "USD",
  occurredAt: {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
    toDate: () => date,
  } as Timestamp,
  status: "PAID",
});

describe("toMonthlyAmount", () => {
  it("ONE_TIME returns 0", () => {
    expect(toMonthlyAmount(makeItem("ONE_TIME", 100))).toBe(0);
  });

  it("MONTHLY is 1× amount", () => {
    expect(toMonthlyAmount(makeItem("MONTHLY", 50))).toBe(50);
  });

  it("YEARLY divides by 12", () => {
    expect(toMonthlyAmount(makeItem("YEARLY", 120))).toBeCloseTo(10);
  });

  it("QUARTERLY divides by 3", () => {
    expect(toMonthlyAmount(makeItem("QUARTERLY", 90))).toBeCloseTo(30);
  });

  it("WEEKLY multiplies by 4.345", () => {
    expect(toMonthlyAmount(makeItem("WEEKLY", 10))).toBeCloseTo(43.45);
  });

  it("BIWEEKLY multiplies by 2.1725", () => {
    expect(toMonthlyAmount(makeItem("BIWEEKLY", 10))).toBeCloseTo(21.725);
  });
});

describe("sumMonthly", () => {
  it("returns 0 for empty array", () => {
    expect(sumMonthly([])).toBe(0);
  });

  it("sums all items monthly equivalents", () => {
    const items = [makeItem("MONTHLY", 100), makeItem("YEARLY", 120)];
    expect(sumMonthly(items)).toBeCloseTo(110);
  });
});

describe("groupByCategory", () => {
  it("returns empty object for empty array", () => {
    expect(groupByCategory([])).toEqual({});
  });

  it("groups and sums by categoryId", () => {
    const items = [
      makeItem("MONTHLY", 100, "catA"),
      makeItem("MONTHLY", 50, "catA"),
      makeItem("MONTHLY", 200, "catB"),
    ];
    const result = groupByCategory(items);
    expect(result["catA"]).toBeCloseTo(150);
    expect(result["catB"]).toBeCloseTo(200);
  });
});

describe("computeMoM", () => {
  it("returns zeros for empty array", () => {
    const result = computeMoM([]);
    expect(result).toEqual({ current: 0, previous: 0, deltaPct: 0 });
  });

  it("calculates delta correctly", () => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
    const txns = [makeTransaction(100, thisMonth), makeTransaction(80, prevMonth)];
    const { current, previous, deltaPct } = computeMoM(txns);
    expect(current).toBe(100);
    expect(previous).toBe(80);
    expect(deltaPct).toBeCloseTo(25);
  });

  it("handles year rollover (December to January)", () => {
    const jan = new Date(2025, 0, 15); // January 2025
    const dec = new Date(2024, 11, 15); // December 2024

    jest.useFakeTimers().setSystemTime(jan);
    const txns = [makeTransaction(200, jan), makeTransaction(150, dec)];
    const { current, previous, deltaPct } = computeMoM(txns);
    expect(current).toBe(200);
    expect(previous).toBe(150);
    expect(deltaPct).toBeCloseTo(33.33, 1);
    jest.useRealTimers();
  });

  it("deltaPct is 0 when previous is 0", () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
    const { deltaPct } = computeMoM([makeTransaction(100, thisMonth)]);
    expect(deltaPct).toBe(0);
  });
});
