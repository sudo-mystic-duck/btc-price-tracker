import { initDb } from "./db";

/*
Creates a server that serves the application under:
- /prices → all prices
- / → latest price
- Adds CORS support for cross-origin requests
*/

export function serve(): void {
  const db = initDb();

  Bun.serve({
    async fetch(req) {
      const url = new URL(req.url);

      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      let data;
      let status = 200;

      try {
        if (url.pathname === "/prices") {
          data = db.query("SELECT * FROM prices ORDER BY id DESC").all();
        } else if (url.pathname === "/") {
          data = db
            .query("SELECT * FROM prices ORDER BY id DESC LIMIT 1")
            .get();
          if (!data) {
            status = 404;
            data = { error: "No prices stored yet" };
          }
        } else {
          status = 404;
          data = { error: "Not Found" };
        }
      } catch (error) {
        console.error(error);
        status = 500;
        data = { error: "Internal Server Error" };
      }

      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      });
    },
  });
}
