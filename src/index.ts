import { output } from "./output";

/*
The main header of the project.
*/

async function main(): Promise<void> {
  console.log("Price Tracker started. Press Ctrl + C to exit.\n");

  while (true) {
    await output();
    console.log("\n");
    await Bun.sleep(30000);
  }
}

main();
