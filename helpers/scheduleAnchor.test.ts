import {
  BACKFILL_MONTHS,
  anchorStartDate,
  scheduleChoiceFromStartDate,
  toDateInputValue,
} from "./scheduleAnchor";

// A Tuesday in the middle of the month, mid-afternoon.
const NOW = new Date(2026, 8, 15, 15, 30);

describe("toDateInputValue", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("anchorStartDate", () => {
  it("anchors every result at noon local", () => {
    for (const frequency of ["ONE_TIME", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"] as const) {
      expect(anchorStartDate({ frequency }, NOW).getHours()).toBe(12);
    }
  });

  describe("ONE_TIME", () => {
    it("uses the given date", () => {
      const d = anchorStartDate({ frequency: "ONE_TIME", date: "2026-03-09" }, NOW);
      expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 2, 9]);
    });

    it("defaults to today and ignores backfill", () => {
      const d = anchorStartDate({ frequency: "ONE_TIME", backfill: true }, NOW);
      expect(toDateInputValue(d)).toBe("2026-09-15");
    });
  });

  describe("MONTHLY", () => {
    it("defaults to the 1st of the current month", () => {
      expect(toDateInputValue(anchorStartDate({ frequency: "MONTHLY" }, NOW))).toBe("2026-09-01");
    });

    it("honours the chosen payment day", () => {
      expect(toDateInputValue(anchorStartDate({ frequency: "MONTHLY", dayOfMonth: 28 }, NOW))).toBe(
        "2026-09-28"
      );
    });

    it("moves BACKFILL_MONTHS back when backfilling, keeping the day", () => {
      const d = anchorStartDate({ frequency: "MONTHLY", dayOfMonth: 12, backfill: true }, NOW);
      expect(toDateInputValue(d)).toBe("2026-03-12");
      expect(BACKFILL_MONTHS).toBe(6);
    });

    it("clamps the 31st to shorter months", () => {
      // Backfilling from September lands in March (31 days) — use a June "now" instead.
      const d = anchorStartDate(
        { frequency: "MONTHLY", dayOfMonth: 31 },
        new Date(2026, 5, 10) // June
      );
      expect(toDateInputValue(d)).toBe("2026-06-30");
    });
  });

  describe("YEARLY", () => {
    it("defaults to January 1st of this year", () => {
      expect(toDateInputValue(anchorStartDate({ frequency: "YEARLY" }, NOW))).toBe("2026-01-01");
    });

    it("uses the chosen month and day", () => {
      const d = anchorStartDate({ frequency: "YEARLY", month: 10, dayOfMonth: 19 }, NOW);
      expect(toDateInputValue(d)).toBe("2026-11-19");
    });

    it("backfill means the most recent anniversary already happened", () => {
      // Nov 19 is still ahead of Sept 15, so the last one was in 2025.
      const future = anchorStartDate(
        { frequency: "YEARLY", month: 10, dayOfMonth: 19, backfill: true },
        NOW
      );
      expect(toDateInputValue(future)).toBe("2025-11-19");

      // Jan 1 already passed this year, so it stays in 2026.
      const past = anchorStartDate({ frequency: "YEARLY", backfill: true }, NOW);
      expect(toDateInputValue(past)).toBe("2026-01-01");
    });
  });

  describe("WEEKLY / BIWEEKLY", () => {
    it("starts at the given date, or today", () => {
      expect(toDateInputValue(anchorStartDate({ frequency: "WEEKLY" }, NOW))).toBe("2026-09-15");
      expect(
        toDateInputValue(anchorStartDate({ frequency: "BIWEEKLY", date: "2026-09-03" }, NOW))
      ).toBe("2026-09-03");
    });

    it("backfills by shifting the start date back", () => {
      const d = anchorStartDate({ frequency: "WEEKLY", date: "2026-09-03", backfill: true }, NOW);
      expect(toDateInputValue(d)).toBe("2026-03-03");
    });
  });
});

describe("scheduleChoiceFromStartDate", () => {
  it("round-trips through anchorStartDate for a monthly item", () => {
    const start = anchorStartDate({ frequency: "MONTHLY", dayOfMonth: 17 }, NOW);
    const choice = scheduleChoiceFromStartDate(start, "MONTHLY");
    expect(choice.dayOfMonth).toBe(17);
    expect(toDateInputValue(anchorStartDate(choice, NOW))).toBe(toDateInputValue(start));
  });

  it("exposes the month for yearly items and the date for one-time ones", () => {
    const choice = scheduleChoiceFromStartDate(new Date(2025, 10, 19, 12), "YEARLY");
    expect(choice.month).toBe(10);
    expect(choice.dayOfMonth).toBe(19);
    expect(choice.date).toBe("2025-11-19");
  });
});
