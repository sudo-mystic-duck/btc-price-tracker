import type { Database } from "bun:sqlite";
import type { NewPrice, PriceRecord } from "./types";

const SELECT_PRICE =
  "SELECT id, base, price, currency, timestamp FROM prices";

const ORDER_NEWEST = "ORDER BY timestamp DESC, id DESC";

export function insertPrice(db: Database, price: NewPrice): void {
  const base = price.base.trim();
  const currency = price.currency.trim();

  if (!base || !currency) {
    throw new Error("base and currency are required");
  }

  if (price.price <= 0) {
    throw new Error("price must be positive");
  }

  db.run(
    "INSERT INTO prices (base, price, currency) VALUES (?, ?, ?)",
    [base, price.price, currency],
  );
}

export function getLatestPrice(db: Database): PriceRecord | null {
  return db
    .query(`${SELECT_PRICE} ${ORDER_NEWEST} LIMIT 1`)
    .get() as PriceRecord | null;
}

export function getAllPrices(db: Database): PriceRecord[] {
  return db
    .query(`${SELECT_PRICE} ${ORDER_NEWEST}`)
    .all() as PriceRecord[];
}

export function ping(db: Database): boolean {
  try {
    db.query("SELECT 1").get();
    return true;
  } catch {
    return false;
  }
}

export function countPrices(db: Database): number {
  const row = db.query("SELECT COUNT(*) AS count FROM prices").get() as {
    count: number;
  };
  return row.count;
}
