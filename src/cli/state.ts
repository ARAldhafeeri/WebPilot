// cli/state.ts

import { v4 as uuidv4 } from "uuid";
import chalk from "chalk";
import { console_out } from "./helpers";

export interface ChatState {
  threadId: string;
  title: string;
  chatHistory: any[]; // Replace with (HumanMessage | AIMessage)[] if you import those types.
  graph: any;
  crawlParams: { url: string; depth: number; base: number };
  browseParams: { browseURL: string; pages: number };
  isUserPrompt: boolean;
  isAiQuestion: boolean;
  aiMessage: string;
}

export let state: ChatState = {
  threadId: uuidv4(),
  title: "Default Chat",
  chatHistory: [],
  graph: null,
  crawlParams: { url: "", depth: 0, base: 0 },
  browseParams: { browseURL: "", pages: 0 },
  isUserPrompt: false,
  isAiQuestion: false,
  aiMessage: "",
};

/**
 * Resets the chat state with a new thread UUID, title, and graph function.
 */
export function resetChatState(
  mode: "research" | "crawl" | "browse",
  graphFn: ChatState["graph"]
) {
  state = {
    threadId: uuidv4(),
    title: `${mode.toUpperCase()} Chat - ${new Date().toLocaleTimeString()}`,
    chatHistory: [],
    graph: graphFn,
    crawlParams: { url: "", depth: 0, base: 0 },
    browseParams: { browseURL: "", pages: 0 },
    isUserPrompt: false,
    isAiQuestion: false,
    aiMessage: "",
  };
  console_out(
    chalk.green(`\n✨ New ${mode} thread started! Thread ID: ${state.threadId}`)
  );
  console_out(chalk.green(`Title: ${state.title}\n`));
}
