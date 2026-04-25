import type { Currency, ExchangeRates } from "../types";

export const currencyToUsd = (
  rates: ExchangeRates | null | undefined
): Record<Currency, (price: number) => number> => ({
  USD: (price) => price,
  COP: (price) => price / (rates?.COP ?? 1),
  SEK: (price) => price / (rates?.SEK ?? 1),
  EUR: (price) => price / (rates?.EUR ?? 1),
});
