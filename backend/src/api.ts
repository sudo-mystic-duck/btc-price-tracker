import type { CoinBase, PriceData } from "./types";

/*
Fetches the BTC price from coinbase.
It gives back an error if it fails.
*/

export async function fetchBtcPrice(): Promise<PriceData> {
  const response = await fetch(
    "https://api.coinbase.com/v2/prices/BTC-USD/spot",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch BTC price.");
  }

  const result = (await response.json()) as CoinBase;

  return {
    amount: parseFloat(result.data.amount),
    base: result.data.base,
    currency: result.data.currency,
  };
}
