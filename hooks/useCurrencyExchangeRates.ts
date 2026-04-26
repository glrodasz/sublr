import { useEffect, useState } from "react";
import type { ExchangeRates } from "../types";

const request = (url: string, options?: RequestInit): Promise<ExchangeRates> =>
  fetch(url, options).then((data) => data.json());

const getRatesFromSessionStorage = (): ExchangeRates | null => {
  try {
    return JSON.parse(sessionStorage.getItem("RATES_FROM_USD") ?? "null");
  } catch {
    return null;
  }
};

const setRatesToSessionStorage = (rates: ExchangeRates) =>
  sessionStorage.setItem("RATES_FROM_USD", JSON.stringify(rates));

const useCurrencyExchangeRates = (): { rates: ExchangeRates | null } => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);

  useEffect(() => {
    async function requestExchange() {
      try {
        const data = await request("api/currencies");
        setRates(data);
      } catch (error) {
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

  return { rates };
};

export default useCurrencyExchangeRates;
