import type { NextApiRequest, NextApiResponse } from "next";

const RATES_FROM_USD = ["COP", "SEK", "EUR"];

const request = (url: string, options?: RequestInit): Promise<{ rates: Record<string, number> }> =>
  fetch(url, options).then((data) => data.json());

const getExchangeRatesApiUrl = (rates: string[]) =>
  `https://api.apilayer.com/exchangerates_data/latest?symbols=${rates.join(",")}&base=USD`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await request(getExchangeRatesApiUrl(RATES_FROM_USD), {
      headers: {
        apiKey: process.env.EXCHANGE_RATES_API_KEY ?? "",
      },
    });

    res.status(200).json({ ...data.rates });
  } catch (error) {
    res.status(500).json({ error });
  }
}
