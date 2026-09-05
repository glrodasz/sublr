import { toChartData } from "./chartData";

const firestoreTs = (date: Date) => ({ toDate: () => date });

describe("toChartData", () => {
  it("returns an empty list for no transactions", () => {
    expect(toChartData([])).toEqual([]);
  });

  it("maps a Firestore Timestamp to a short label", () => {
    const [point] = toChartData([
      { occurredAt: firestoreTs(new Date(2026, 2, 9)), amount: 42, name: "Netflix" },
    ]);
    expect(point).toEqual({ label: "Mar 9", amount: 42, name: "Netflix" });
  });

  it("also accepts an ISO string, which is how serialised data arrives", () => {
    const [point] = toChartData([
      { occurredAt: "2026-03-09T12:00:00.000Z", amount: 10, name: "Spotify" },
    ]);
    expect(point.label).toMatch(/Mar \d+/);
    expect(point.amount).toBe(10);
  });

  it("preserves order and length", () => {
    const points = toChartData([
      { occurredAt: firestoreTs(new Date(2026, 0, 1)), amount: 1, name: "a" },
      { occurredAt: firestoreTs(new Date(2026, 1, 1)), amount: 2, name: "b" },
      { occurredAt: firestoreTs(new Date(2026, 2, 1)), amount: 3, name: "c" },
    ]);
    expect(points).toHaveLength(3);
    expect(points.map((p) => p.name)).toEqual(["a", "b", "c"]);
  });
});
