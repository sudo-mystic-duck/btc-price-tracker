import { Database } from "bun:sqlite";
import { config } from "../config";
import { migrate } from "./schema";

let db: Database | undefined;

export function openDatabase(path: string): Database {
  const database = new Database(path);
  migrate(database);
  return database;
}

export function initDb(): Database {
  if (!db) {
    try {
      db = openDatabase(config.dbPath);
    } catch (error: unknown) {
      console.error("Database error:", error);
      process.exit(1);
    }
  }
  return db;
}

export function getDb(): Database {
  return initDb();
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = undefined;
  }
}

/** Test-only: replace the singleton with an in-memory database */
export function useTestDatabase(path: string = ":memory:"): Database {
  closeDb();
  db = openDatabase(path);
  return db;
}

export function resetTestDatabase(): void {
  closeDb();
}
