import type { CoinBase, PriceData } from "./types";

export async function fetchBtcPrice(): Promise<PriceData> {
  const response = await fetch(
    "https://api.coinbase.com/v2/prices/BTC-USD/spot",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch BTC price.");
  }

  const result = (await response.json()) as CoinBase;
  const amount = Number.parseFloat(result.data.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid BTC price from API.");
  }

  return {
    amount,
    base: result.data.base,
    currency: result.data.currency,
  };
}
