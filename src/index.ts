// src/index.ts
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import chalk from "chalk";
import figlet from "figlet";
import ora from "ora";
import { graph } from "./graph/index";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import { existsSync, writeFileSync } from "node:fs";

// ASCII Art & Styling
console.clear();
console.log(
  chalk.hex("#00ff99")(figlet.textSync("WebPilotAI", { font: "Doom" }))
);
console.log(chalk.hex("#00ccff").bold("  Next-Gen Browser Automation CLI\n"));

// Environment Setup
if (!existsSync(".env")) {
  const rl = createInterface({ input: stdin, output: stdout });
  console.log(chalk.yellow("🔧 Initial setup required 🔧"));

  let envContent = "";

  const requiredKeys = [
    "API_KEY",
    "MODEL_PROVIDER",
    "MODEL_SLUG",
    "TAVILY_API_KEY",
    "SEARCH_RESULTS",
  ];

  for (const key of requiredKeys) {
    const value = await rl.question(chalk.cyan(`Enter value for ${key}: `));
    envContent += `${key}=${value}\n`;
  }

  writeFileSync(".env", envContent);
  console.log(chalk.green("✅ Configuration saved!"));
  rl.close();
}

dotenv.config();

// CLI Interface
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: chalk.hex("#ff9900")("🌀 WebPilot> "),
});

// Chat History
const chatHistory: (HumanMessage | AIMessage)[] = [];

// Typewriter Effect
async function typewriter(text: string, speed = 10) {
  for (const char of text) {
    process.stdout.write(chalk.hex("#00ff99")(char));
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
  console.log("\n");
}

// Main Chat Loop
rl.prompt();

rl.on("line", async (input) => {
  if (input.toLowerCase() === "/exit") {
    console.log(chalk.yellow("\n🛸 Farewell, space traveler!"));
    process.exit(0);
  }

  const spinner = ora({
    text: chalk.hex("#ff66ff")("Accessing neural network..."),
    spinner: "dots2",
  }).start();

  try {
    chatHistory.push(new HumanMessage({ content: input }));

    const stream = await graph.stream(
      { messages: chatHistory },
      { recursionLimit: 150 }
    );

    spinner.succeed(chalk.green("AI Response:"));
    let fullResponse = "";
    for await (const chunk of stream) {
      if (chunk?.messages?.[0]) {
        const content = chunk.messages[0].content;
        await typewriter(content);
        fullResponse += content;
      }
    }

    chatHistory.push(new AIMessage({ content: fullResponse }));
  } catch (error: any) {
    spinner.fail(chalk.red("Quantum flux detected!"));
    console.error(chalk.red(`Error: ${error.message}`));
  }

  rl.prompt();
}).on("close", () => {
  console.log(chalk.yellow("\n🌌 Connection terminated"));
  process.exit(0);
});
