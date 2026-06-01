import type { Database } from "bun:sqlite";
import { config } from "./config";
import { getAllPrices, getLatestPrice, ping } from "./db/prices";

export function jsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": config.corsOrigin,
  };
}

export async function handleRequest(
  db: Database,
  req: Request,
): Promise<Response> {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(req.url);

  if (url.pathname === "/health") {
    const ok = ping(db);
    return new Response(JSON.stringify({ status: ok ? "ok" : "error" }), {
      status: ok ? 200 : 503,
      headers: jsonHeaders(),
    });
  }

  if (url.pathname === "/prices") {
    try {
      const rows = getAllPrices(db);
      return new Response(JSON.stringify(rows), { headers: jsonHeaders() });
    } catch (error) {
      console.error(error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  if (url.pathname === "/") {
    try {
      const price = getLatestPrice(db);

      if (!price) {
        return new Response("No prices stored yet", { status: 404 });
      }

      return new Response(JSON.stringify(price), { headers: jsonHeaders() });
    } catch (error) {
      console.error(error);
      return new Response("Failed to fetch price", { status: 500 });
    }
  }

  return new Response("Not Found", { status: 404 });
}
