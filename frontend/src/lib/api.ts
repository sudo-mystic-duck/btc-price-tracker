import type { Data } from "./types";

export async function fetchBtcPrice(): Promise<Data> {
  const response = await fetch("http://localhost:3000/");
  if (!response.ok) throw new Error("Failed to fetch BTC price.");

  return await response.json();
}
