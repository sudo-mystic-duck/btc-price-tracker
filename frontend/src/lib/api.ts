import type { Data } from "./types";
import { apiBase } from "./config";

export async function fetchNewPrice(): Promise<Data> {
  const response = await fetch(`${apiBase}/`);
  if (!response.ok) throw new Error("Failed to fetch BTC price.");

  return await response.json();
}

export async function fetchAllPrices(): Promise<Data[]> {
  const response = await fetch(`${apiBase}/prices`);
  if (!response.ok) throw new Error("Failed to fetch all BTC prices.");

  return await response.json();
}
