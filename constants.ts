import type { Currency, Frequency } from "./types";

export const LANG_PER_CURRENCY: Record<Currency, string> = {
  USD: "en-US",
  EUR: "en-IE",
  MXN: "es-MX",
  GBP: "en-GB",
  SEK: "en-SE",
  CHF: "de-CH",
  JPY: "ja-JP",
  COP: "es-CO",
};

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
export const SELECTABLE_CURRENCIES: { value: Currency; label: string }[] = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "MXN", label: "MXN" },
  { value: "GBP", label: "GBP" },
  { value: "SEK", label: "SEK" },
  { value: "CHF", label: "CHF" },
  { value: "JPY", label: "JPY" },
  { value: "COP", label: "COP" },
];

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  ONE_TIME: "One time",
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};
