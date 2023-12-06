import { useEffect, useState } from "react";

const request = (url, options) =>
  fetch(url, options).then((data) => data.json());


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
        const data = await request("api/currencies");

        setRates(data);
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
