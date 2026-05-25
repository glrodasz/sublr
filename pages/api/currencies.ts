import type { NextApiRequest, NextApiResponse } from "next";
import { request } from "../../lib/request";

const RATES_FROM_USD = ["COP", "SEK", "EUR"];

const getExchangeRatesApiUrl = (rates: string[]) =>
  `https://api.apilayer.com/exchangerates_data/latest?symbols=${rates.join(",")}&base=USD`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  if (!apiKey) {
    console.error("EXCHANGE_RATES_API_KEY is not set");
    return res.status(503).json({ error: "Exchange rates service unavailable" });
  }

  try {
    const data = await request<{ rates: Record<string, number> }>(
      getExchangeRatesApiUrl(RATES_FROM_USD),
      { headers: { apikey: apiKey } }
    );

    res.status(200).json({ ...data.rates });
  } catch (error) {
    console.error("currencies api error:", error);
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
}
