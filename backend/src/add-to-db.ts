import { fetchBtcPrice } from "./api";
import { db } from "./db";

/*
Gets the current Bitcoin price from api.ts and adds it to the database.
*/

export async function addToDb(): Promise<void> {
  try {
    const data = await fetchBtcPrice();

    db.run("INSERT INTO prices (base, price, currency) VALUES (?, ?, ?)", [
      data.base,
      data.amount,
      data.currency,
    ]);
  } catch (error: unknown) {
    console.error("Error: ", error);
  }
}
