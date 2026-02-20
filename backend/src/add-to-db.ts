import { fetchBtcPrice } from "./api";
import { initDb } from "./db";

/*
Gets the current Bitcoin price from api.ts and adds it to the database.
*/

export async function addToDb(): Promise<void> {
  const data = await fetchBtcPrice();
  const db = initDb();

  db.run("INSERT INTO prices (base, price, currency) VALUES (?, ?, ?)", [
    data.base,
    data.amount,
    data.currency,
  ]);
}
