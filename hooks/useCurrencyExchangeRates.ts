import { useEffect, useState } from "react";
import type { ExchangeRates } from "../types";
import { request } from "../lib/request";

const STORAGE_KEY = "RATES_FROM_USD";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface CachedRates {
  rates: ExchangeRates;
  fetchedAt: number;
}

const getCachedRates = (): ExchangeRates | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedRates;
    if (!cached?.rates || typeof cached.fetchedAt !== "number") return null;
    if (Date.now() - cached.fetchedAt > CACHE_TTL_MS) return null;
    return cached.rates;
  } catch {
    return null;
  }
};

const setCachedRates = (rates: ExchangeRates) => {
  try {
    const payload: CachedRates = { rates, fetchedAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage may be unavailable (private mode / SSR); caching is best-effort.
  }
};

interface UseCurrencyExchangeRatesResult {
  rates: ExchangeRates | null;
  error: Error | null;
  isLoading: boolean;
}

const useCurrencyExchangeRates = (): UseCurrencyExchangeRatesResult => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cached = getCachedRates();
    if (cached) {
      setRates(cached);
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await request<ExchangeRates>("api/currencies");
        if (cancelled) return;
        setRates(data);
        setCachedRates(data);
      } catch (caught) {
        if (cancelled) return;
        const err = caught instanceof Error ? caught : new Error(String(caught));
        console.error(err);
        setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { rates, error, isLoading };
};

export default useCurrencyExchangeRates;
