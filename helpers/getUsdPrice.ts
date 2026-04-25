import type { Currency, ExchangeRates } from "../types";
import { currencyToUsd } from "./currencyToUsd";

export const getUsdPrice = (
  price: number,
  currency: Currency,
  rates: ExchangeRates | null | undefined
): number => Number(currencyToUsd(rates)[currency](price).toFixed(2));
