import { getDb } from "./db/index";
import { config } from "./config";
import { handleRequest } from "./handler";

export function serve(): void {
  const db = getDb();

  Bun.serve({
    port: config.port,
    fetch: (req) => handleRequest(db, req),
  });

  console.log(`Server listening on http://localhost:${config.port}`);
}
