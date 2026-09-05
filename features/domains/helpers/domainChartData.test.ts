import { toDomainChartData } from "./domainChartData";
import { IDENTITY_RATES } from "../../../helpers/fx";
import type { ExchangeRates } from "../../../helpers/fx";
import type { Currency } from "../../../types";

const firestoreTs = (date: Date) => ({ toDate: () => date });
const ctx = { rates: IDENTITY_RATES, target: "USD" as Currency };

describe("toDomainChartData", () => {
  it("returns an empty list for no transactions", () => {
    expect(toDomainChartData([], ctx)).toEqual([]);
  });

  it("maps a Firestore Timestamp to a short label", () => {
    const [point] = toDomainChartData(
      [
        {
          occurredAt: firestoreTs(new Date(2026, 2, 9)),
          amount: 42,
          currency: "USD",
          name: "Netflix",
        },
      ],
      ctx
    );
    expect(point).toEqual({ label: "Mar 9", amount: 42, name: "Netflix" });
  });

  it("also accepts an ISO string, which is how serialised data arrives", () => {
    const [point] = toDomainChartData(
      [{ occurredAt: "2026-03-09T12:00:00.000Z", amount: 10, currency: "USD", name: "Spotify" }],
      ctx
    );
    expect(point.label).toMatch(/Mar \d+/);
    expect(point.amount).toBe(10);
  });

  it("converts amounts into the reporting currency", () => {
    const rates: ExchangeRates = {
      base: "USD",
      rates: { USD: 1, EUR: 1, MXN: 1, GBP: 1, SEK: 1, CHF: 1, JPY: 1, COP: 4000 },
      fetchedAt: "2026-06-01T00:00:00.000Z",
    };
    const [point] = toDomainChartData(
      [{ occurredAt: "2026-03-09T12:00:00.000Z", amount: 40000, currency: "COP", name: "Rent" }],
      { rates, target: "USD" }
    );
    expect(point.amount).toBe(10);
  });

  it("preserves order and length", () => {
    const points = toDomainChartData(
      [
        { occurredAt: firestoreTs(new Date(2026, 0, 1)), amount: 1, currency: "USD", name: "a" },
        { occurredAt: firestoreTs(new Date(2026, 1, 1)), amount: 2, currency: "USD", name: "b" },
        { occurredAt: firestoreTs(new Date(2026, 2, 1)), amount: 3, currency: "USD", name: "c" },
      ],
      ctx
    );
    expect(points.map((p) => p.amount)).toEqual([1, 2, 3]);
  });
});
