import { afterEach, describe, expect, test } from "bun:test";
import { Database } from "bun:sqlite";
import { migrate, SCHEMA_VERSION } from "./schema";
import { resetTestDatabase } from "./connection";

afterEach(() => resetTestDatabase());

describe("migrate", () => {
  test("creates prices and schema_version on fresh database", () => {
    const db = new Database(":memory:");
    migrate(db);

    const version = db
      .query("SELECT version FROM schema_version LIMIT 1")
      .get() as { version: number };
    expect(version.version).toBe(SCHEMA_VERSION);

    const tables = db
      .query(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      )
      .all() as { name: string }[];
    expect(tables.map((t) => t.name)).toContain("prices");
    expect(tables.map((t) => t.name)).toContain("schema_version");

    db.close();
  });

  test("is idempotent when run twice", () => {
    const db = new Database(":memory:");
    migrate(db);
    migrate(db);

    const version = db
      .query("SELECT version FROM schema_version LIMIT 1")
      .get() as { version: number };
    expect(version.version).toBe(SCHEMA_VERSION);
    db.close();
  });

  test("migrates legacy loose schema to strict columns", () => {
    const db = new Database(":memory:");
    db.run(`
      CREATE TABLE prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        base TEXT,
        price REAL,
        currency TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    db.run(
      "INSERT INTO prices (base, price, currency) VALUES ('BTC', 100, 'USD')",
    );
    db.run(
      "INSERT INTO prices (base, price, currency) VALUES (NULL, 50, 'USD')",
    );

    migrate(db);

    const count = db.query("SELECT COUNT(*) AS c FROM prices").get() as {
      c: number;
    };
    expect(count.c).toBe(1);

    expect(() => {
      db.run(
        "INSERT INTO prices (base, price, currency) VALUES ('BTC', -1, 'USD')",
      );
    }).toThrow();

    db.close();
  });

  test("creates timestamp index", () => {
    const db = new Database(":memory:");
    migrate(db);

    const indexes = db
      .query(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='prices'",
      )
      .all() as { name: string }[];

    expect(indexes.some((i) => i.name === "idx_prices_timestamp")).toBe(true);
    db.close();
  });

  test("migrates v2 database to v3 index", () => {
    const db = new Database(":memory:");
    db.run(`
      CREATE TABLE schema_version (version INTEGER NOT NULL);
      INSERT INTO schema_version (version) VALUES (2);
      CREATE TABLE prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        base TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
      CREATE INDEX idx_prices_timestamp ON prices (timestamp DESC);
    `);

    migrate(db);

    const version = db
      .query("SELECT version FROM schema_version LIMIT 1")
      .get() as { version: number };
    expect(version.version).toBe(SCHEMA_VERSION);
    db.close();
  });
});
