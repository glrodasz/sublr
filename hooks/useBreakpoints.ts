import { useEffect, useState } from "react";

const QUERIES = {
  isMobile: "(max-width: 799px)",
  isDesktop: "(min-width: 992px)",
} as const;

type Breakpoint = keyof typeof QUERIES;
type Breakpoints = Record<Breakpoint, boolean>;

const read = (): Breakpoints => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return { isMobile: false, isDesktop: false };
  }
  return {
    isMobile: window.matchMedia(QUERIES.isMobile).matches,
    isDesktop: window.matchMedia(QUERIES.isDesktop).matches,
  };
};

const useBreakpoints = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>(read);

  useEffect(() => {
    const lists = (Object.keys(QUERIES) as Breakpoint[]).map((key) =>
      window.matchMedia(QUERIES[key])
    );
    const handler = () => setBreakpoints(read());

    lists.forEach((mql) => mql.addEventListener("change", handler));
    handler();

    return () => lists.forEach((mql) => mql.removeEventListener("change", handler));
  }, []);

  return breakpoints;
};

export default useBreakpoints;
