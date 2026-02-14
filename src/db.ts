import { Database } from "bun:sqlite";

/*
Creates a new database.
*/

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
