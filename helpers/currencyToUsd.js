export const currencyToUsd = (rates) => ({
	USD: (price) => price,
	COP: (price) => price / rates?.COP ?? 1,
	SEK: (price) => price / rates?.SEK ?? 1,
	EUR: (price) => price / rates?.EUR ?? 1,
  });