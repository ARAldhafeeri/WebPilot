import { existsSync, writeFileSync } from "node:fs";
import { createInterface, Interface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import chalk from "chalk";
import { console_out } from "./helpers";

export async function initialSetup() {
  if (!existsSync(".env")) {
    const rlSetup: Interface = createInterface({
      input: stdin,
      output: stdout,
    });
    console_out(chalk.yellow("🔧 Initial setup required 🔧"));
    const apiKey = await rlSetup.question(
      chalk.cyan("Enter your DeepSeek/OpenAI API key: ")
    );
    writeFileSync(".env", `AI_API_KEY=${apiKey}\n`);
    console_out(chalk.green("✅ Configuration saved!\n"));
    rlSetup.close();
  }
}
