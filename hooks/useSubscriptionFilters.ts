import { useState, useMemo } from "react";
import type { Currency, TimeAttribute, Subscription, ExchangeRates } from "../types";
import { getUsdPrice } from "../helpers";

interface UseSubscriptionFiltersResult {
  time: TimeAttribute;
  setTime: (v: TimeAttribute) => void;
  currency: Currency;
  setCurrency: (v: Currency) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  card: string;
  setCard: (v: string) => void;
  tags: string[];
  setTags: (v: string[]) => void;
  tagOptions: string[];
  filteredSubscriptions: Subscription[];
}

const useSubscriptionFilters = (
  subscriptions: Subscription[],
  rates: ExchangeRates | null
): UseSubscriptionFiltersResult => {
  const [time, setTime] = useState<TimeAttribute>("YEARLY");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [sortBy, setSortBy] = useState("PRICE");
  const [card, setCard] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const tagOptions = useMemo(
    () => [...new Set(subscriptions.flatMap((s) => (s.tags ?? []).map((t) => t.toLowerCase())))],
    [subscriptions]
  );

  const filteredSubscriptions = useMemo(
    () =>
      subscriptions
        .filter(({ creditCard, tags: subTags }) => {
          if (card) return `${creditCard?.type}_${creditCard?.number}` === card;
          if (Array.isArray(tags) && tags.length)
            return tags.map((t) => (subTags ?? []).includes(t)).find(Boolean);
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "NAME") return (a.title ?? "").localeCompare(b.title ?? "");
          if (sortBy === "PRICE")
            return (
              Number(
                getUsdPrice(b.time === "MONTHLY" ? b.price * 12 : b.price, b.currency, rates)
              ) -
              Number(getUsdPrice(a.time === "MONTHLY" ? a.price * 12 : a.price, a.currency, rates))
            );
          if (sortBy === "CARD") return Number(a.creditCard?.number) - Number(b.creditCard?.number);
          return 0;
        }),
    [subscriptions, card, tags, sortBy, rates]
  );

  return {
    time,
    setTime,
    currency,
    setCurrency,
    sortBy,
    setSortBy,
    card,
    setCard,
    tags,
    setTags,
    tagOptions,
    filteredSubscriptions,
  };
};

export default useSubscriptionFilters;
