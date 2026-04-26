import { useEffect, useState } from "react";

const useMedia = <T>(queries: string[], values: T[], defaultValue?: T): T | undefined => {
  const mediaQueryLists = queries.map((q) =>
    typeof window !== "undefined" ? window.matchMedia(q) : ({} as MediaQueryList)
  );

  const getValue = (): T | undefined => {
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    return typeof values[index] !== "undefined" ? values[index] : defaultValue;
  };

  const [value, setValue] = useState<T | undefined>(getValue);

  useEffect(() => {
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach((mql) => mql.addListener(handler));

    return () => mediaQueryLists.forEach((mql) => mql.removeListener(handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
};

export default useMedia;
