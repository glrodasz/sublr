import { renderHook, waitFor } from "@testing-library/react";
import useCurrencyExchangeRates from "./useCurrencyExchangeRates";
import { request } from "../lib/request";

jest.mock("../lib/request");

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe("useCurrencyExchangeRates", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedRequest.mockReset();
  });

  it("fetches rates when nothing is cached and stores them", async () => {
    mockedRequest.mockResolvedValue({ COP: 4000 });

    const { result } = renderHook(() => useCurrencyExchangeRates());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rates).toEqual({ COP: 4000 });
    expect(result.current.error).toBeNull();
    expect(JSON.parse(sessionStorage.getItem("RATES_FROM_USD")!).rates).toEqual({ COP: 4000 });
  });

  it("uses a fresh cache without calling the network", async () => {
    sessionStorage.setItem(
      "RATES_FROM_USD",
      JSON.stringify({ rates: { EUR: 0.9 }, fetchedAt: Date.now() })
    );

    const { result } = renderHook(() => useCurrencyExchangeRates());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rates).toEqual({ EUR: 0.9 });
    expect(mockedRequest).not.toHaveBeenCalled();
  });

  it("ignores an expired cache and refetches", async () => {
    sessionStorage.setItem(
      "RATES_FROM_USD",
      JSON.stringify({ rates: { EUR: 0.9 }, fetchedAt: Date.now() - 24 * 60 * 60 * 1000 })
    );
    mockedRequest.mockResolvedValue({ EUR: 0.95 });

    const { result } = renderHook(() => useCurrencyExchangeRates());

    await waitFor(() => expect(result.current.rates).toEqual({ EUR: 0.95 }));
    expect(mockedRequest).toHaveBeenCalled();
  });

  it("surfaces an error when the request fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockedRequest.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useCurrencyExchangeRates());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toEqual(new Error("network down"));
    expect(result.current.rates).toBeNull();
  });
});
