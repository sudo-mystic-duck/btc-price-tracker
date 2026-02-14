import { reduceEachTrailingCommentRange } from "typescript";

interface CoinBase {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

interface PriceData {
  amount: number;
  base: string;
  currency: string;
}

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
