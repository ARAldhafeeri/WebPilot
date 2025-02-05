// cli/chatLoop.ts

import chalk from "chalk";
import ora from "ora";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { graph } from "../graph/index"; // Adjust path as needed
import { APP_MODES, setModeFromMemoryStore } from "../config/modes";
import { getCrawlParams, console_out, prettifyOutput } from "./helpers";
import { state, resetChatState } from "./state";
import { crawlTool } from "../tools/crawl";
import { displayBanner } from "./banner";
import rl from "./rl";

const COMMANDS = ["/research", "/crawl", "/browse", "/exit"];

export async function chatLoop() {
  displayBanner();
  console_out(chalk.magenta(`Current Mode: ${state.title}`));
  console_out(
    chalk.magenta(
      `Type your message or use commands (/research, /crawl, /browse, /exit):\n`
    )
  );

  // Ensure the prompt reflects the current chat state.
  rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
  rl.prompt();

  rl.on("line", async (input: string) => {
    try {
      const trimmed = input.trim();

      // Exit command.
      if (trimmed.toLowerCase() === "/exit") {
        console_out(chalk.yellow("\n🛸 Farewell, space traveler!"));
        rl.close();
        process.exit(0);
      }

      // Mode switch commands.
      else if (trimmed.toLowerCase() === "/research") {
        resetChatState("research", graph.research);
        await setModeFromMemoryStore(APP_MODES.research);
        rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
        rl.prompt();
        return;
      } else if (trimmed.toLowerCase() === "/crawl") {
        const { depth, base, url } = await getCrawlParams(rl);
        resetChatState("crawl", graph.crawl);
        state.crawlParams = { depth, base, url };
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
        console_out(
          chalk.red("please select chat type: /research, /crawl, /browse")
        );
        rl.setPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));
        rl.prompt();
        return;
      }

      // Process a normal chat message.
      const spinner = ora({
        text: chalk.hex("#ff66ff")("Accessing neural network..."),
        spinner: "dots2",
      }).start();

      try {
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
          state.chatHistory.push(new HumanMessage({ content: input }));
        }

        // Call the current graph function using the chat thread’s context.
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
          fullResponse += chunk;
          await prettifyOutput(chunk);
        }
        state.chatHistory.push(new AIMessage({ content: fullResponse }));
      } catch (error: any) {
        spinner.fail(chalk.red("Quantum flux detected!"));
        console_out(chalk.red(`Error: ${error.message}`));
      }
    } catch (error: any) {
      console_out(chalk.red(`Unexpected error: ${error.message}`));
    } finally {
      rl.prompt();
    }
  }).on("close", () => {
    console_out(chalk.yellow("\n🌌 Connection terminated"));
    process.exit(0);
  });
}
