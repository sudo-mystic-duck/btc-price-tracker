import { afterEach, describe, expect, test } from "bun:test";
import {
  countPrices,
  getAllPrices,
  getLatestPrice,
  insertPrice,
  ping,
} from "./prices";
import { resetTestDatabase, useTestDatabase } from "./connection";

afterEach(() => resetTestDatabase());

describe("prices repository", () => {
  test("insert and get latest returns newest row", () => {
    const db = useTestDatabase();

    insertPrice(db, { base: "BTC", price: 100, currency: "USD" });
    insertPrice(db, { base: "BTC", price: 200, currency: "USD" });

    const latest = getLatestPrice(db);
    expect(latest?.price).toBe(200);
    expect(latest?.base).toBe("BTC");
    expect(latest?.currency).toBe("USD");
    expect(latest?.id).toBe(2);
  });

  test("get latest returns null when empty", () => {
    const db = useTestDatabase();
    expect(getLatestPrice(db)).toBeNull();
  });

  test("getAllPrices returns newest first", () => {
    const db = useTestDatabase();
    insertPrice(db, { base: "BTC", price: 1, currency: "USD" });
    insertPrice(db, { base: "BTC", price: 2, currency: "USD" });
    insertPrice(db, { base: "BTC", price: 3, currency: "USD" });

    const all = getAllPrices(db);
    expect(all.map((p) => p.price)).toEqual([3, 2, 1]);
  });

  test("getAllPrices returns empty array when no rows", () => {
    const db = useTestDatabase();
    expect(getAllPrices(db)).toEqual([]);
  });

  test("rejects non-positive price", () => {
    const db = useTestDatabase();
    expect(() =>
      insertPrice(db, { base: "BTC", price: 0, currency: "USD" }),
    ).toThrow("price must be positive");
    expect(() =>
      insertPrice(db, { base: "BTC", price: -1, currency: "USD" }),
    ).toThrow("price must be positive");
    expect(countPrices(db)).toBe(0);
  });

  test("rejects empty base or currency", () => {
    const db = useTestDatabase();
    expect(() =>
      insertPrice(db, { base: "  ", price: 1, currency: "USD" }),
    ).toThrow("required");
    expect(() =>
      insertPrice(db, { base: "BTC", price: 1, currency: "" }),
    ).toThrow("required");
  });

  test("orders by timestamp when ids are out of sync", () => {
    const db = useTestDatabase();
    db.run(
      "INSERT INTO prices (id, base, price, currency, timestamp) VALUES (1, 'BTC', 100, 'USD', '2020-01-01 00:00:00')",
    );
    db.run(
      "INSERT INTO prices (id, base, price, currency, timestamp) VALUES (2, 'BTC', 200, 'USD', '2019-01-01 00:00:00')",
    );

    expect(getLatestPrice(db)?.price).toBe(100);
    expect(getAllPrices(db).map((p) => p.price)).toEqual([100, 200]);
  });

  test("ping returns true on healthy database", () => {
    const db = useTestDatabase();
    expect(ping(db)).toBe(true);
  });

  test("countPrices tracks inserts", () => {
    const db = useTestDatabase();
    expect(countPrices(db)).toBe(0);
    insertPrice(db, { base: "BTC", price: 1, currency: "USD" });
    expect(countPrices(db)).toBe(1);
  });
});
