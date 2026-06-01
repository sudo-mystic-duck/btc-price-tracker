import { fetchBtcPrice } from "./api";
import { getDb, insertPrice } from "./db";

export async function addToDb(): Promise<void> {
  const data = await fetchBtcPrice();
  const db = getDb();

  insertPrice(db, {
    base: data.base,
    price: data.amount,
    currency: data.currency,
  });
}
