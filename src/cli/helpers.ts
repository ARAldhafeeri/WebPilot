// cli/helpers.ts

import chalk from "chalk";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import rl from "./rl";
import { NODE_NAMES } from "../config/names";
import { state } from "./state";
import { graph } from "../graph/index"; // Adjust path as needed
import { APP_MODES, setModeFromMemoryStore } from "../config/modes";
import { resetChatState } from "./state";

export const COMMANDS = [
  "/research",
  "/crawl",
  "/browse",
  "/exit",
  "/crawl/reset",
];
export const workflows = {
  research: "/research",
  crawl: "/crawl",
  browse: "/browse",
  noCommad: "noCommad",
  chat: "chat",
  exit: "/exit",
  crawlReset: "/crawl/reset",
};
// Clear the current line and output a new message.
export function console_out(msg: string) {
  console.log(msg);
  rl.prompt(true);
}

export function setCliPrompt(prompt: any) {
  rl.setPrompt(prompt);
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
export async function messageContent(output: Record<string, any>) {
  const keys = Object.keys(output);
  const firstItem = output[keys[0]];
  if (!firstItem) return "";

  if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
    const lastMessage = firstItem.messages[firstItem.messages.length - 1];
    // Adjust the sender check as needed (here using a literal 'reporter')
    if ("sender" in firstItem && firstItem["sender"] === NODE_NAMES.reporter) {
      if (lastMessage.content) {
        return lastMessage.content;
      }
    }
  }
  return "";
}

export function isCrawlThread(chatTitle: string) {
  return chatTitle.includes("CRAWL");
}

export function isResearchThread(chatTitle: string) {
  return chatTitle.includes("RESEARCH");
}

export function isBrowseThread(chatTitle: string) {
  return chatTitle.includes("BROWSE");
}

// commands

export async function onUserInput(userInput: string) {
  const trimmed = userInput.trim();
  const command = trimmed.toLowerCase();
  if (!command) {
    rl.prompt();
    return;
  }
  switch (command) {
    case workflows.exit:
      console.log(chalk.yellow("\n🌌 The stars dim as you depart..."));
      console.log(
        chalk.magenta.bold("🚀 Safe travels, spacefarer. Until we meet again!")
      );
      rl.close();
      process.exit(0);

    case workflows.research:
      resetChatState("research", graph.research);
      await setModeFromMemoryStore(APP_MODES.research);
      setCliPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      return workflows.research;

    case workflows.crawl: {
      const { depth, base, url } = await getCrawlParams(rl);
      resetChatState("crawl", graph.crawl);
      state.crawlParams = { depth, base, url };
      await setModeFromMemoryStore(APP_MODES.crawl);
      setCliPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));

      return workflows.crawl;
    }
    case workflows.crawlReset:
      const { depth, base, url } = await getCrawlParams(rl);
      resetChatState("crawl", graph.crawl);
      state.crawlParams = { depth, base, url };
      await setModeFromMemoryStore(APP_MODES.crawl);
      setCliPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));

      return workflows.crawl;

    case workflows.browse:
      resetChatState("browse", graph.browse);
      await setModeFromMemoryStore(APP_MODES.browse);
      setCliPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      return workflows.browse;
    // user in chat
    default:
      // If input is not a recognized command and the
      //  default chat type is still active.
      // ask user to enter a thread with the a.i
      // if the user in a thread with the a.i continue
      if (!COMMANDS.includes(command) && state.title === "Default Chat") {
        console_out(
          chalk.red(
            `please select chat type: ${COMMANDS.join(", ")} then Enter`
          )
        );
        rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
        rl.prompt(true);
        return workflows.noCommad;
      } else {
        rl.prompt(true);
        return;
      }
  }
}

// chats
