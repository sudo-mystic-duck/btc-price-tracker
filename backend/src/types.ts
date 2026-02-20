export interface CoinBase {
  data: {
    amount: string;
    base: string;
    currency: string;
  };
}

export interface PriceData {
  amount: number;
  base: string;
  currency: string;
}
