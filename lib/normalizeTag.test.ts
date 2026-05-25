import { normalizeTag, normalizeTags } from "./normalizeTag";

describe("normalizeTag", () => {
  it("trims and lowercases", () => {
    expect(normalizeTag("  Community  ")).toBe("community");
  });

  it("collapses internal whitespace", () => {
    expect(normalizeTag("Non   Essential")).toBe("non essential");
  });

  it("returns an empty string for nullish/empty input", () => {
    expect(normalizeTag("")).toBe("");
    expect(normalizeTag(undefined as unknown as string)).toBe("");
  });
});

describe("normalizeTags", () => {
  it("normalizes, filters empties, and dedupes preserving order", () => {
    expect(normalizeTags(["Foo", " foo ", "BAR", "", "   ", "bar", "Baz"])).toEqual([
      "foo",
      "bar",
      "baz",
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(normalizeTags([])).toEqual([]);
  });
});
