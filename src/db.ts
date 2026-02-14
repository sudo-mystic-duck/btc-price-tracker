import { Database } from "bun:sqlite";

export const db = new Database("db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT,
      price REAL,
      currency TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);
