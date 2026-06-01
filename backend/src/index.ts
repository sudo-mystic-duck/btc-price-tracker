import { serve } from "./server";
import { addToDb } from "./add-to-db";
import { config } from "./config";
import { closeDb } from "./db/index";

async function main(): Promise<void> {
  serve();

  try {
    await addToDb();
  } catch (error: unknown) {
    console.error("Initial price fetch failed:", error);
  }

  const poll = setInterval(async () => {
    try {
      await addToDb();
    } catch (error: unknown) {
      console.error(error);
    }
  }, config.pollIntervalMs);

  const shutdown = () => {
    clearInterval(poll);
    closeDb();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
