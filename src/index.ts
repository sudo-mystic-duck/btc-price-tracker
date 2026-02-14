import { fetchBtcPrice } from "./api";
import {} from "./db";

async function main(): Promise<void> {
  try {
    const data = await fetchBtcPrice();
    console.log(data);
  } catch (error: unknown) {
    console.error(error);
  }
}

main();
