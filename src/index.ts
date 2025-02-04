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
import { AppState } from "./graph/state";
import { APP_MODES } from "./agents/modes";
// It is assumed that your graph module exports dedicated functions:
//   - research(params, options)
//   - crawl(params, options)
//   - browse(params, options)
// All of which should match the signature:
//   (params: { messages: (HumanMessage | AIMessage)[]; threadId?: string; title?: string }, options?: Record<string, unknown>)
//      => AsyncIterable<{ messages: { content: string }[] }>

dotenv.config();

// ================
// Helper Functions
// ================

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

/**
 * Prints text to the console using a typewriter effect.
 * @param text The text to print.
 * @param speed The delay (in ms) between characters.
 */
async function typewriter(text: string, speed = 10) {
  for (const char of text) {
    process.stdout.write(chalk.hex("#00ff99")(char));
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
  console.log();
}

// ======================
// Global Chat State
// ======================

interface ChatState {
  threadId: string;
  title: string;
  chatHistory: (HumanMessage | AIMessage)[];
  currentGraphFn: any;
}

// Default state: starting with a “normal” chat using the default graph stream.
let state: ChatState = {
  threadId: uuidv4(),
  title: "Default Chat",
  chatHistory: [],
  currentGraphFn: null,
};

/**
 * Resets the chat state with a new thread UUID, title, and graph function.
 * @param mode The new chat mode: "research", "crawl", or "browse".
 * @param graphFn The dedicated graph function for this mode.
 */
function resetChatState(
  mode: "research" | "crawl" | "browse",
  graphFn: ChatState["currentGraphFn"]
) {
  state = {
    threadId: uuidv4(),
    title: `${mode.toUpperCase()} Chat - ${new Date().toLocaleTimeString()}`,
    chatHistory: [],
    currentGraphFn: graphFn,
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
    if (trimmed.toLowerCase() === "/research") {
      resetChatState("research", graph.research);
      AppState.State.mode = APP_MODES.research;
      rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      rl.prompt();
      return;
    }

    if (trimmed.toLowerCase() === "/crawl") {
      resetChatState("crawl", graph.crawl);
      AppState.State.mode = APP_MODES.crawl;
      rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
      rl.prompt();
      return;
    }

    if (trimmed.toLowerCase() === "/browse") {
      resetChatState("browse", graph.browse);
      AppState.State.mode = APP_MODES.browse;
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
      // Add the user's message to the history.
      state.chatHistory.push(new HumanMessage({ content: input }));

      // Call the current graph function using the current thread's context.
      const stream = await state.currentGraphFn(
        {
          messages: state.chatHistory,
          threadId: state.threadId,
          title: state.title,
        },
        { recursionLimit: 150 }
      );
      spinner.succeed(chalk.green("AI Response:"));

      let fullResponse = "";
      for await (const chunk of stream) {
        if (chunk?.messages?.[0]?.content) {
          const content = chunk.messages[0].content;
          await typewriter(content);
          fullResponse += content;
        }
      }

      // Append the AI response to the chat history.
      state.chatHistory.push(new AIMessage({ content: fullResponse }));
    } catch (error: any) {
      spinner.fail(chalk.red("Quantum flux detected!"));
      console.error(chalk.red(`Error: ${error.message}`));
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
