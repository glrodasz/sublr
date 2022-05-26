import { currencyToUsd } from './currencyToUsd'

export const getUsdPrice = (price, currency, rates) =>
  Number(currencyToUsd(rates)[currency](price).toFixed(2));