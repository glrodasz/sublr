import type { Currency, Frequency } from "./types";

/**
 * The single source of truth for supported currencies. `Currency` (types),
 * `CurrencySchema` (zod) and the FX API symbol list are all derived from it —
 * adding a currency here propagates everywhere.
 */
export const CURRENCIES = ["USD", "EUR", "MXN", "GBP", "SEK", "CHF", "JPY", "COP"] as const;

/** Currencies conventionally written without decimal places. */
export const ZERO_DECIMAL_CURRENCIES: Set<Currency> = new Set(["JPY", "COP"]);

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  MXN: "$",
  GBP: "£",
  SEK: "kr",
  CHF: "Fr",
  JPY: "¥",
  COP: "$",
};

/** Currencies offered during onboarding, in display order. */
export const SELECTABLE_CURRENCIES: { value: Currency; label: string }[] = CURRENCIES.map((c) => ({
  value: c,
  label: c,
}));

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  ONE_TIME: "One time",
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};
