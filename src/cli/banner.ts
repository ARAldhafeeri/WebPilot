// cli/banner.ts

import chalk from "chalk";
import figlet from "figlet";
import { console_out } from "./helpers";

export function displayBanner() {
  console.clear();
  console_out(
    chalk.hex("#00ff99")(figlet.textSync("WebPilotAI", { font: "Doom" }))
  );
  console_out(chalk.hex("#00ccff").bold("  Next-Gen AI Powered CLI\n"));
}
