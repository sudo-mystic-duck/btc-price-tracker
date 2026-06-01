import { afterEach, describe, expect, test } from "bun:test";
import { addToDb } from "./add-to-db";
import { countPrices, getLatestPrice } from "./db/prices";
import { resetTestDatabase, useTestDatabase } from "./db/connection";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  resetTestDatabase();
});

describe("addToDb", () => {
  test("fetches from API and persists row", async () => {
    const db = useTestDatabase();
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          data: { amount: "99999.99", base: "BTC", currency: "USD" },
        }),
        { status: 200 },
      )) as typeof fetch;

    await addToDb();

    expect(countPrices(db)).toBe(1);
    expect(getLatestPrice(db)?.price).toBe(99999.99);
  });

  test("does not insert when API fails", async () => {
    const db = useTestDatabase();
    globalThis.fetch = (async () =>
      new Response("error", { status: 503 })) as typeof fetch;

    await expect(addToDb()).rejects.toThrow();
    expect(countPrices(db)).toBe(0);
  });
});
