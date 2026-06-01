export interface PriceRecord {
  id: number;
  base: string;
  price: number;
  currency: string;
  timestamp: string;
}

export interface NewPrice {
  base: string;
  price: number;
  currency: string;
}
