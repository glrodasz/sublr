import { getTagStyle } from "./tagStyles";

const PALETTE = [
  "var(--accent, #7cffb2)",
  "var(--accent-hot, #ff3d68)",
  "var(--accent-amber, #ffb84d)",
  "var(--accent-cyan, #5ee8ff)",
];

describe("getTagStyle", () => {
  it("returns the curated color for an exact preset", () => {
    expect(getTagStyle("essential").color).toBe("var(--accent, #7cffb2)");
  });

  it("matches presets case- and whitespace-insensitively", () => {
    expect(getTagStyle("  Community  ").color).toBe("var(--accent-amber, #ffb84d)");
  });

  it("matches the 'non-essential' preset via partial inclusion", () => {
    expect(getTagStyle("Non Essential").color).toBe("var(--accent-hot, #ff3d68)");
  });

  it("assigns a stable color from the fallback palette for unknown tags", () => {
    const a = getTagStyle("travel").color;
    const b = getTagStyle("Travel").color;
    expect(a).toBe(b);
    expect(PALETTE).toContain(a);
  });

  it("spreads different unknown tags across the palette", () => {
    const colors = new Set(
      ["travel", "music", "books", "gym", "saas", "fitness"].map((t) => getTagStyle(t).color)
    );
    expect(colors.size).toBeGreaterThan(1);
  });

  it("returns the first palette colour for empty input", () => {
    expect(getTagStyle("").color).toBe(PALETTE[0]);
  });
});
