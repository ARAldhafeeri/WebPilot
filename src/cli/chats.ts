import { marked } from "marked";
import { state } from "./state";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { crawlTool } from "../tools/crawl";
import { console_out, messageContent } from "./helpers";
import ora from "ora";
import chalk from "chalk";
import rl from "./rl";

export async function onCrawlChat(userMessage: string) {
  // crawl chat logic
  const { depth, base, url } = state.crawlParams;
  const data = await crawlTool(depth, url, base);
  const stringData = JSON.stringify(data);
  state.chatHistory.push(
    new HumanMessage({
      content: `CRAWL RESULTS: ${stringData} \n\nUSER QUESTION: ${userMessage}`,
    })
  );
}

export async function onResearchChat(userMessage: string) {
  // research chat logic
  state.chatHistory.push(
    new HumanMessage({
      content: userMessage,
    })
  );
}

export async function onAiMessage(aiMessage: string) {
  state.chatHistory.push(
    new AIMessage({
      content: aiMessage,
    })
  );
}

export async function onBrwoseChat(userMessage: string) {
  // browse chat logic
  state.chatHistory.push(
    new HumanMessage({
      content: userMessage,
    })
  );
}

export async function onChatResponseWithLoader(aiChtResponse: Function) {
  const spinner = ora({
    text: chalk.hex("#ff66ff")("Accessing neural network..."),
    spinner: "dots2",
    // very important the cli exit
    discardStdin: false,
  }).start();
  const output = await aiChtResponse();
  spinner.succeed(chalk.green("Ai response:"));
  console_out(output);
}

export async function onChatResponse() {
  const stream = await state.graph.stream(
    {
      messages: state.chatHistory,
      threadId: state.threadId,
      title: state.title,
    },
    { recursionLimit: 150 }
  );

  let fullResponse = "";
  for await (const chunk of stream) {
    fullResponse += await messageContent(chunk);
  }
  state.chatHistory.push(new AIMessage({ content: fullResponse }));
  // const output = await marked.parse(fullResponse);
  const output = fullResponse;

  return output;
}
