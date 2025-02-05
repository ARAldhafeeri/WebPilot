import dotenv from "dotenv";
import { initialSetup } from "./cli/initialSetup";
import { chatLoop } from "./cli/chatloop";

dotenv.config();

async function main() {
  await initialSetup();
  // Start the interactive chat loop.
  chatLoop();
}

await main();
