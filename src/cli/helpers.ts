// cli/helpers.ts

import chalk from "chalk";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import rl from "./rl";
import { NODE_NAMES } from "../config/names";

// Clear the current line and output a new message.
export function console_out(msg: string) {
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}

// Prompts the user for crawl parameters.
export async function getCrawlParams(
  rl: any
): Promise<{ depth: number; base: number; url: string }> {
  const depth = parseInt(
    await rl.question(chalk.cyan("Enter crawl depth (1-3): "))
  );
  const base = parseInt(
    await rl.question(chalk.cyan("Enter base links per page (1-10): "))
  );
  const url = await rl.question(chalk.cyan("Enter starting URL: "));
  return { depth, base, url };
}

// Configure the Markdown renderer.
marked.setOptions({
  renderer: new TerminalRenderer() as unknown as any,
});

// Prettify and output AI messages formatted in Markdown.
export async function prettifyOutput(output: Record<string, any>) {
  const keys = Object.keys(output);
  const firstItem = output[keys[0]];
  if (!firstItem) return;

  if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
    const lastMessage = firstItem.messages[firstItem.messages.length - 1];
    // Adjust the sender check as needed (here using a literal 'reporter')
    if ("sender" in firstItem && firstItem["sender"] === NODE_NAMES.reporter) {
      if (lastMessage.content) {
        console_out(await marked.parse(lastMessage.content));
      }
    }
  }
}
