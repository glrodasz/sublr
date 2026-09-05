import { PERIODS, getStartDate } from "./periods";

describe("PERIODS", () => {
  it("starts at the current month", () => {
    expect(PERIODS[0]).toEqual({ label: "Current", months: 0 });
  });

  it("has strictly increasing windows", () => {
    const months = PERIODS.map((p) => p.months);
    expect(months).toEqual([...months].sort((a, b) => a - b));
  });
});

describe("getStartDate", () => {
  it("snaps to the first of the month for the current period", () => {
    const start = getStartDate(0, new Date(2026, 5, 17, 14, 30));
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(5);
    expect(start.getDate()).toBe(1);
  });

  it("counts back whole months for the other periods", () => {
    const now = new Date(2026, 5, 17);
    expect(getStartDate(1, now).getMonth()).toBe(4);
    expect(getStartDate(3, now).getMonth()).toBe(2);
    expect(getStartDate(6, now).getMonth()).toBe(11);
  });

  it("crosses the year boundary", () => {
    const start = getStartDate(6, new Date(2026, 5, 17));
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(11);
  });

  it("goes back a full year for the 1Y window", () => {
    const start = getStartDate(12, new Date(2026, 5, 17));
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(5);
  });

  it("does not mutate the date it was given", () => {
    const now = new Date(2026, 5, 17);
    getStartDate(3, now);
    expect(now.getMonth()).toBe(5);
  });
});
