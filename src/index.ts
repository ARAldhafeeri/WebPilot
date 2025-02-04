#!/usr/bin/env node
// src/index.ts

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import chalk from "chalk";
import figlet from "figlet";
import ora from "ora";
import dotenv from "dotenv";
import { existsSync, writeFileSync } from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { graph } from "./graph/index";
import { APP_MODES, setModeFromMemoryStore } from "./config/modes";
import { prettifyOutput } from "./utils/cli";
import { crawlTool } from "./tools/crawl";

dotenv.config();

// ================
// Helper Functions
// ================
async function getCrawlParams(
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

const COMMANDS = ["/research", "/crawl", "/browse", "/exit"];

/**
 * Performs the initial setup by prompting for an API key if a .env file is missing.
 */
async function initialSetup() {
  if (!existsSync(".env")) {
    const rlSetup = createInterface({ input: stdin, output: stdout });
    console.log(chalk.yellow("🔧 Initial setup required 🔧"));
    const apiKey = await rlSetup.question(
      chalk.cyan("Enter your DeepSeek/OpenAI API key: ")
    );
    writeFileSync(".env", `AI_API_KEY=${apiKey}\n`);
    console.log(chalk.green("✅ Configuration saved!\n"));
    rlSetup.close();
  }
}

/**
 * Displays an ASCII art banner.
 */
function displayBanner() {
  console.clear();
  console.log(
    chalk.hex("#00ff99")(figlet.textSync("WebPilotAI", { font: "Doom" }))
  );
  console.log(chalk.hex("#00ccff").bold("  Next-Gen Browser Automation CLI\n"));
}

// ======================
// Global Chat State
// ======================

interface ChatState {
  threadId: string;
  title: string;
  chatHistory: (HumanMessage | AIMessage)[];
  graph: any;
  crawlParams: { url: string; depth: number; base: number };
}

// Default state: starting with a “normal” chat using the default graph stream.
let state: ChatState = {
  threadId: uuidv4(),
  title: "Default Chat",
  chatHistory: [],
  graph: null,
  crawlParams: { url: "", depth: 0, base: 0 },
};

/**
 * Resets the chat state with a new thread UUID, title, and graph function.
 * @param mode The new chat mode: "research", "crawl", or "browse".
 * @param graphFn The dedicated graph function for this mode.
 */
function resetChatState(
  mode: "research" | "crawl" | "browse",
  graphFn: ChatState["graph"]
) {
  state = {
    threadId: uuidv4(),
    title: `${mode.toUpperCase()} Chat - ${new Date().toLocaleTimeString()}`,
    chatHistory: [],
    graph: graphFn,
    crawlParams: { url: "", depth: 0, base: 0 },
  };
  console.log(
    chalk.green(`\n✨ New ${mode} thread started! Thread ID: ${state.threadId}`)
  );
  console.log(chalk.green(`Title: ${state.title}\n`));
}

// ======================
// Interactive Chat Loop
// ======================

async function chatLoop() {
  displayBanner();
  console.log(chalk.magenta(`Current Mode: ${state.title}`));
  console.log(
    chalk.magenta(
      `Type your message or use commands (/research, /crawl, /browse, /exit):\n`
    )
  );

  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: chalk.hex("#ff9900")(`🌀 [${state.title}]> `),
  });

  rl.prompt();

  rl.on("line", async (input: string) => {
    const trimmed = input.trim();

    // Check for global commands:
    if (trimmed.toLowerCase() === "/exit") {
      console.log(chalk.yellow("\n🛸 Farewell, space traveler!"));
      rl.close();
      process.exit(0);
    }

    // Check for mode-switch commands:
    else if (trimmed.toLowerCase() === "/research") {
      resetChatState("research", graph.research);
      await setModeFromMemoryStore(APP_MODES.research);
      rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      rl.prompt();
      return;
    } else if (trimmed.toLowerCase() === "/crawl") {
      const { depth, base, url } = await getCrawlParams(rl);

      // Store parameters in state
      resetChatState("crawl", graph.crawl);
      state.crawlParams = { depth, base, url }; // Add this to ChatState interface

      await setModeFromMemoryStore(APP_MODES.crawl);
      rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      rl.prompt();
      return;
    } else if (trimmed.toLowerCase() === "/browse") {
      resetChatState("browse", graph.browse);

      await setModeFromMemoryStore(APP_MODES.browse);
      rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      rl.prompt();
      return;
    } else if (
      !COMMANDS.includes(trimmed.toLowerCase()) &&
      state.title === "Default Chat"
    ) {
      console.log(
        chalk.red("please select chat type: /research, /crawl, /browse")
      );
      rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      rl.prompt();
      return;
    }

    // Otherwise, process the user input as a normal chat message.
    const spinner = ora({
      text: chalk.hex("#ff66ff")("Accessing neural network..."),
      spinner: "dots2",
    }).start();

    try {
      // handle crawl
      // chatgpt safe gaurds as soon as it sees url
      // it says it can't search, it can't blah blah blah
      // so this is the fucking solution
      if (state.title.includes("CRAWL")) {
        const { depth, base, url } = state.crawlParams;
        state.chatHistory.push(
          new HumanMessage({
            content: `CRAWL RESULTS: ${JSON.stringify(
              await crawlTool(depth, url, base)
            )}\n\nUSER QUESTION: ${input}`,
          })
        );
      } else {
        // Add the user's message to the history.
        state.chatHistory.push(new HumanMessage({ content: input }));
      }

      // Call the current graph function using the current thread's context.
      const stream = await state.graph.stream(
        {
          messages: state.chatHistory,
          threadId: state.threadId,
          title: state.title,
        },
        { recursionLimit: 150 }
      );
      spinner.succeed(chalk.green("AI Response:"));

      let fullResponse = "";
      for await (const chunk of await stream) {
        prettifyOutput(chunk);
      }

      // Append the AI response to the chat history.
      state.chatHistory.push(new AIMessage({ content: fullResponse }));
    } catch (error: any) {
      spinner.fail(chalk.red("Quantum flux detected!"));
      console.error(chalk.red(`Error: ${error.message}`), error);
    }
    rl.prompt();
  }).on("close", () => {
    console.log(chalk.yellow("\n🌌 Connection terminated"));
    process.exit(0);
  });
}

// ======================
// Main Entry Point
// ======================

async function main() {
  await initialSetup();
  // Start the chat loop.
  chatLoop();
}

main().catch((error) => {
  console.error(chalk.red(`Fatal Error: ${error.message}`));
  process.exit(1);
});
