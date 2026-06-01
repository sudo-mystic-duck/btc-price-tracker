import { afterEach, describe, expect, test } from "bun:test";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("fetchNewPrice", () => {
  test("returns parsed JSON on success", async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          id: 1,
          base: "BTC",
          price: 100,
          currency: "USD",
          timestamp: "2024-01-01T00:00:00Z",
        }),
        { status: 200 },
      )) as typeof fetch;

    const { fetchNewPrice } = await import("./api");
    const data = await fetchNewPrice();
    expect(data.price).toBe(100);
  });

  test("throws on non-ok response", async () => {
    globalThis.fetch = (async () =>
      new Response("", { status: 500 })) as typeof fetch;

    const { fetchNewPrice } = await import("./api");
    await expect(fetchNewPrice()).rejects.toThrow("Failed to fetch BTC price");
  });
});

describe("fetchAllPrices", () => {
  test("returns array on success", async () => {
    globalThis.fetch = (async () =>
      new Response(JSON.stringify([{ id: 1, price: 1 }]), {
        status: 200,
      })) as typeof fetch;

    const { fetchAllPrices } = await import("./api");
    const data = await fetchAllPrices();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(1);
  });

  test("throws on non-ok response", async () => {
    globalThis.fetch = (async () =>
      new Response("", { status: 404 })) as typeof fetch;

    const { fetchAllPrices } = await import("./api");
    await expect(fetchAllPrices()).rejects.toThrow("Failed to fetch all");
  });
});
