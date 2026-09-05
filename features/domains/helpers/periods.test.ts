import { PERIODS, DEFAULT_PERIOD_INDEX, getStartDate } from "./periods";

describe("PERIODS", () => {
  it("starts at the current month", () => {
    expect(PERIODS[0]).toEqual({ label: "Current", months: 0 });
  });

  it("has strictly increasing windows", () => {
    const months = PERIODS.map((p) => p.months);
    expect(months).toEqual([...months].sort((a, b) => a - b));
  });

  it("defaults to a window that always has data, not month-to-date", () => {
    expect(PERIODS[DEFAULT_PERIOD_INDEX]).toEqual({ label: "1M", months: 1 });
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

  it("clamps to the target month's last day instead of overflowing", () => {
    // May 31 minus one month is April, which has no 31st: naive setMonth()
    // rolls forward into May again.
    const start = getStartDate(1, new Date(2026, 4, 31));
    expect(start.getMonth()).toBe(3);
    expect(start.getDate()).toBe(30);
  });

  it("starts the window at midnight so the first day counts whole", () => {
    const start = getStartDate(1, new Date(2026, 5, 17, 23, 45));
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });
});
