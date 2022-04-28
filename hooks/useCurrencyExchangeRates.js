import { useEffect, useState } from "react";

const request = (url, options) =>
  fetch(url, options).then((data) => data.json());

const RATES_FROM_USD = ["COP", "SEK", "EUR"];

const getExchangeRatesApiUrl = (rates) =>
  `https://api.exchangerate.host/latest?symbols=${rates.join(",")}&base=USD`;

const getRatesFromSessionStorage = () => {
  try {
    return JSON.parse(sessionStorage.getItem("RATES_FROM_USD"));
  } catch {
    return null;
  }
};
const setRatesToSessionStorage = (rates) =>
  sessionStorage.setItem("RATES_FROM_USD", JSON.stringify(rates));

const useCurrencyExchangeRates = () => {
  const [rates, setRates] = useState(null);

  useEffect(() => {
    async function requestExchange() {
      try {
        const data = await request(getExchangeRatesApiUrl(RATES_FROM_USD));

        setRates({ ...data.rates });
      } catch (erorr) {
        console.error(error);
      }
    }
    const ratesFromSessionStorage = getRatesFromSessionStorage();
    if (ratesFromSessionStorage) {
      setRates(ratesFromSessionStorage);
    } else {
      requestExchange();
    }
  }, []);

  useEffect(() => {
    if (!getRatesFromSessionStorage() && rates) {
      setRatesToSessionStorage(rates);
    }
  }, [rates]);

  return {
    rates,
  };
};

export default useCurrencyExchangeRates;
