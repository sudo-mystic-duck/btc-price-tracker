import { afterEach, describe, expect, test } from "bun:test";
import { fetchBtcPrice } from "./api";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchBtcPrice", () => {
  test("parses valid Coinbase spot response", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          data: { amount: "50000.12", base: "BTC", currency: "USD" },
        }),
        { status: 200 },
      )) as typeof fetch;

    const result = await fetchBtcPrice();
    expect(result).toEqual({
      amount: 50000.12,
      base: "BTC",
      currency: "USD",
    });
  });

  test("throws when response is not ok", async () => {
    globalThis.fetch = (async () =>
      new Response("error", { status: 500 })) as typeof fetch;

    await expect(fetchBtcPrice()).rejects.toThrow("Failed to fetch BTC price.");
  });

  test("throws when amount is not a number", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          data: { amount: "not-a-number", base: "BTC", currency: "USD" },
        }),
        { status: 200 },
      )) as typeof fetch;

    await expect(fetchBtcPrice()).rejects.toThrow("Invalid BTC price");
  });

  test("throws when amount is zero or negative", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          data: { amount: "0", base: "BTC", currency: "USD" },
        }),
        { status: 200 },
      )) as typeof fetch;

    await expect(fetchBtcPrice()).rejects.toThrow("Invalid BTC price");
  });

  test("throws on network failure", async () => {
    globalThis.fetch = (async () => {
      throw new Error("network down");
    }) as typeof fetch;

    await expect(fetchBtcPrice()).rejects.toThrow("network down");
  });

  test("handles integer amount strings", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          data: { amount: "100000", base: "BTC", currency: "USD" },
        }),
        { status: 200 },
      )) as typeof fetch;

    const result = await fetchBtcPrice();
    expect(result.amount).toBe(100000);
  });

  test("handles very small positive amounts", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          data: { amount: "0.01", base: "BTC", currency: "USD" },
        }),
        { status: 200 },
      )) as typeof fetch;

    const result = await fetchBtcPrice();
    expect(result.amount).toBe(0.01);
  });
});
