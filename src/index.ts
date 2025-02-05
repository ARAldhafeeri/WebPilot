import dotenv from "dotenv";
import { initialSetup } from "./cli/initialSetup";
import { chatLoop } from "./cli/chatloop";
import "./cli/socketServer";

dotenv.config();

async function main() {
  await initialSetup();
  // Start the interactive chat loop.
  chatLoop();
}

main().catch((error) => {
  console.error(`Fatal Error: ${error.message}`);
  process.exit(1);
});
