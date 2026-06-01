import { afterEach, describe, expect, test } from "bun:test";
import { handleRequest } from "./handler";
import { insertPrice } from "./db/prices";
import { resetTestDatabase, useTestDatabase } from "./db/connection";

afterEach(() => resetTestDatabase());

describe("handleRequest", () => {
  test("GET / returns 404 when database is empty", async () => {
    const db = useTestDatabase();
    const res = await handleRequest(db, new Request("http://localhost/"));
    expect(res.status).toBe(404);
    expect(await res.text()).toContain("No prices");
  });

  test("GET / returns latest price as JSON", async () => {
    const db = useTestDatabase();
    insertPrice(db, { base: "BTC", price: 42000.5, currency: "USD" });

    const res = await handleRequest(db, new Request("http://localhost/"));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.price).toBe(42000.5);
    expect(body.base).toBe("BTC");
    expect(res.headers.get("Content-Type")).toContain("application/json");
  });

  test("GET /prices returns all rows newest first", async () => {
    const db = useTestDatabase();
    insertPrice(db, { base: "BTC", price: 1, currency: "USD" });
    insertPrice(db, { base: "BTC", price: 2, currency: "USD" });

    const res = await handleRequest(
      db,
      new Request("http://localhost/prices"),
    );
    const body = (await res.json()) as { price: number }[];
    expect(body.map((r) => r.price)).toEqual([2, 1]);
  });

  test("GET /prices returns empty array when no data", async () => {
    const db = useTestDatabase();
    const res = await handleRequest(
      db,
      new Request("http://localhost/prices"),
    );
    expect(await res.json()).toEqual([]);
  });

  test("GET /health returns ok", async () => {
    const db = useTestDatabase();
    const res = await handleRequest(
      db,
      new Request("http://localhost/health"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  test("unknown path returns 404", async () => {
    const db = useTestDatabase();
    const res = await handleRequest(
      db,
      new Request("http://localhost/unknown"),
    );
    expect(res.status).toBe(404);
  });

  test("POST / returns 405", async () => {
    const db = useTestDatabase();
    insertPrice(db, { base: "BTC", price: 1, currency: "USD" });
    const res = await handleRequest(db, new Request("http://localhost/", {
      method: "POST",
    }));
    expect(res.status).toBe(405);
  });
});
