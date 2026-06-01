import type { Database } from "bun:sqlite";

export const SCHEMA_VERSION = 3;

const CREATE_PRICES_TABLE = `
  CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    base TEXT NOT NULL,
    price REAL NOT NULL CHECK (price > 0),
    currency TEXT NOT NULL,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

const CREATE_TIMESTAMP_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_prices_timestamp
  ON prices (timestamp DESC, id DESC);
`;

const CREATE_SCHEMA_VERSION = `
  CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER NOT NULL
  );
`;

function getStoredVersion(db: Database): number {
  const row = db
    .query("SELECT version FROM schema_version LIMIT 1")
    .get() as { version: number } | null;
  return row?.version ?? 0;
}

function setVersion(db: Database, version: number): void {
  db.run("DELETE FROM schema_version");
  db.run("INSERT INTO schema_version (version) VALUES (?)", [version]);
}

function migrateToV1(db: Database): void {
  db.run(CREATE_PRICES_TABLE);
}

function migrateToV2(db: Database): void {
  db.run(CREATE_TIMESTAMP_INDEX);

  const columns = db
    .query("PRAGMA table_info(prices)")
    .all() as { name: string; notnull: number }[];

  const baseCol = columns.find((c) => c.name === "base");
  const needsMigration = baseCol !== undefined && baseCol.notnull === 0;

  if (needsMigration) {
    db.run("BEGIN");
    try {
      db.run(`
        CREATE TABLE prices_migrated (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          base TEXT NOT NULL,
          price REAL NOT NULL CHECK (price > 0),
          currency TEXT NOT NULL,
          timestamp TEXT NOT NULL DEFAULT (datetime('now'))
        );
      `);
      db.run(`
        INSERT INTO prices_migrated (id, base, price, currency, timestamp)
        SELECT id, base, price, currency, timestamp
        FROM prices
        WHERE base IS NOT NULL
          AND currency IS NOT NULL
          AND price IS NOT NULL
          AND price > 0;
      `);
      db.run("DROP TABLE prices");
      db.run("ALTER TABLE prices_migrated RENAME TO prices");
      db.run(CREATE_TIMESTAMP_INDEX);
      db.run("COMMIT");
    } catch (error) {
      db.run("ROLLBACK");
      throw error;
    }
  }
}

function migrateToV3(db: Database): void {
  db.run("DROP INDEX IF EXISTS idx_prices_timestamp");
  db.run(CREATE_TIMESTAMP_INDEX);
}

export function migrate(db: Database): void {
  db.run(CREATE_SCHEMA_VERSION);

  let version = getStoredVersion(db);

  if (version < 1) {
    migrateToV1(db);
    version = 1;
    setVersion(db, version);
  }

  if (version < 2) {
    migrateToV2(db);
    version = 2;
    setVersion(db, version);
  }

  if (version < 3) {
    migrateToV3(db);
    setVersion(db, SCHEMA_VERSION);
  }
}
