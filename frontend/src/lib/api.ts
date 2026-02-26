import type { Data } from "./types";

export async function fetchNewPrice(): Promise<Data> {
  const response = await fetch("http://localhost:3000/");
  if (!response.ok) throw new Error("Failed to fetch BTC price.");

  return await response.json();
}

export async function fetchAllPrices(): Promise<Data> {
  const response = await fetch("http://localhost:3000/all");
  if (!response.ok) throw new Error("Failed to fetch all BTC prices.");

  return await response.json();
}
