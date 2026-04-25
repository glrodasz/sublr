import type { Currency, TimeAttribute } from "./types";

export const DEFAULT_UNSPLASH_ID = "3zx-cgfbFAg";

export const TIME_DESCRIPTION: Record<TimeAttribute, string> = {
  MONTHLY: "/mo",
  YEARLY: "/year",
};

export const TIME_ATTRIBUTE: Record<TimeAttribute, string> = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
};

export const CREDIT_CARD_TYPES: Record<string, string> = {
  MASTERCARD: "MasterCard",
  VISA: "VISA",
};

export const LANG_PER_CURRENCY: Record<Currency, string> = {
  USD: "en-US",
  COP: "es-CO",
  SEK: "en-SE",
  EUR: "en-IE",
};
