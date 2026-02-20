import { serve } from "./server";
import { addToDb } from "./add-to-db";

/*
The control center of the application.
*/

function main(): void {
  serve();

  setInterval(async () => {
    try {
      await addToDb();
    } catch (error: unknown) {
      console.error(error);
    }
  }, 30000);
}

main();
