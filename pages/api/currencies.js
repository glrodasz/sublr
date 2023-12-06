const RATES_FROM_USD = ["COP", "SEK", "EUR"];

const request = (url, options) =>
  fetch(url, options).then((data) => data.json());

const getExchangeRatesApiUrl = (rates) =>
  `https://api.apilayer.com/exchangerates_data/latest?symbols=${rates.join(
    ","
  )}&base=USD`;

export default async function handler(req, res) {
  try {
    const data = await request(getExchangeRatesApiUrl(RATES_FROM_USD), {
      headers: {
        apiKey: process.env.EXCHANGE_RATES_API_KEY,
      },
    });

    res.status(200).json({ ...data.rates });
  } catch (error) {
	res.status(500).json({ error });
  }
}
