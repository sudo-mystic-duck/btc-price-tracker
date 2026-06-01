export function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

export const config = {
  port: envInt("PORT", 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  pollIntervalMs: envInt("POLL_INTERVAL_MS", 30_000),
  dbPath: process.env.DB_PATH ?? "db.sqlite",
} as const;
