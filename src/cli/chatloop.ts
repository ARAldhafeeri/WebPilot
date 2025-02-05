// cli/chatLoop.ts

import chalk from "chalk";
import {
  console_out,
  setCliPrompt,
  isCrawlThread,
  isResearchThread,
  onUserInput,
  workflows,
} from "./helpers";
import {
  onCrawlChat,
  onResearchChat,
  onBrwoseChat,
  onChatResponseWithLoader,
  onChatResponse,
} from "./chats";

import { state } from "./state";
import { displayBanner } from "./banner";
import rl from "./rl";

export async function chatLoop() {
  displayBanner();
  console_out(chalk.magenta(`Current Mode: ${state.title}`));
  console_out(
    chalk.magenta(
      `Type your message or use commands (/research, /crawl, /browse, /exit):\n`
    )
  );

  setCliPrompt(chalk.hex("#ff9900")(`🌀 [${state.title}]> `));

  rl.on("line", async (input: string) => {
    const workfLowOutput = await onUserInput(input);

    switch (workfLowOutput) {
      // handle default chat commands
      case workflows.research:
        return;
      case workflows.browse:
        return;
      case workflows.crawl:
        return;
      case workflows.noCommad:
        return;
      default:
        if (isCrawlThread(state.title)) {
          await onCrawlChat(input);
          state.isUserPrompt = true;
        } else if (isResearchThread(state.title)) {
          await onResearchChat(input);
          state.isUserPrompt = true;
        } else {
          await onBrwoseChat(input);
          state.isUserPrompt = true;
        }
        if (state.isUserPrompt) {
          await onChatResponseWithLoader(onChatResponse);
        } else {
          rl.prompt(true);
        }
        return;
    }
  }).on("close", () => {
    console_out(chalk.yellow("\n🌌 Connection terminated"));
    process.exit(0);
  });
}
