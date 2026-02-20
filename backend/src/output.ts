import { fetchBtcPrice } from "./api";
import { db } from "./db";

/*
Gets the BTC price from api.ts and saves it to the database.
It gives back an error if it fails.
*/

export async function output(): Promise<void> {
  try {
    const data = await fetchBtcPrice();
    console.log(data);

    db.run("INSERT INTO prices (ticker, price, currency) VALUES (?, ?, ?)", [
      data.base,
      data.amount,
      data.currency,
    ]);

    console.log("Succesfully saved to db.sqlite");
  } catch (error: unknown) {
    console.error("Error: ", error);
  }
}
