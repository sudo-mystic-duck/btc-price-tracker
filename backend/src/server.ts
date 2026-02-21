import { initDb } from "./db";

/*
Creates a server that serves the application under:
- /prices → all prices
- / → latest price
*/

export function serve(): void {
  const db = initDb();

  Bun.serve({
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/prices") {
        try {
          const rows = db.query("SELECT * FROM prices ORDER BY id DESC").all();

          return new Response(JSON.stringify(rows), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:5173",
            },
          });
        } catch (error) {
          console.error(error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }

      if (url.pathname === "/") {
        try {
          const price = db
            .query("SELECT * FROM prices ORDER BY id DESC LIMIT 1")
            .get();

          if (!price) {
            return new Response("No prices stored yet", { status: 404 });
          }

          return new Response(JSON.stringify(price), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:5173",
            },
          });
        } catch (error) {
          console.error(error);
          return new Response("Failed to fetch price", { status: 500 });
        }
      }

      return new Response("Not Found", { status: 404 });
    },
  });
}
