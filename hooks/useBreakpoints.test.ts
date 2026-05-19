import { renderHook } from "@testing-library/react";
import useBreakpoints from "./useBreakpoints";

const setMatchMedia = (matcher: (query: string) => boolean) => {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: matcher(query),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
};

describe("useBreakpoints", () => {
  it("reports mobile when the mobile query matches", () => {
    setMatchMedia((q) => q.includes("max-width"));

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it("reports desktop when the desktop query matches", () => {
    setMatchMedia((q) => q.includes("min-width"));

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });
});
