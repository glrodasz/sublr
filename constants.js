export const DEFAULT_UNSPLASH_ID = "3zx-cgfbFAg";

const ONE_USD_TO_COP = 3741.50;
const ONE_USD_TO_SEK = 9.68;
const ONE_USD_TO_EUR = 0.90;

export const TIME_DESCRIPTION = {
  MONTHLY: "/mo",
  YEARLY: "/year",
};

export const CREDIT_CARD_TYPES = {
  VISA: "visa",
  MASTERCARD: "mastercard",
};

export const CURRENCY_TO_USD = {
  "USD": price => price,
  "COP": price => price / ONE_USD_TO_COP,
  "SEK": price => price / ONE_USD_TO_SEK,
  "EUR": price => price / ONE_USD_TO_EUR
}
