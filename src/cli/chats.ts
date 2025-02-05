import { marked } from "marked";
import { state } from "./state";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { crawlTool } from "../tools/crawl";
import { console_out, messageContent, setCliPrompt } from "./helpers";
import ora from "ora";
import chalk from "chalk";

export async function onCrawlChat(userMessage: string) {
  if (!Boolean(userMessage)) return;
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
  if (!Boolean(userMessage)) return;
  // research chat logic
  state.chatHistory.push(
    new HumanMessage({
      content: userMessage,
    })
  );
}

export async function onAiMessage(aiMessage: string) {
  if (!Boolean(aiMessage)) return;

  state.chatHistory.push(
    new AIMessage({
      content: aiMessage,
    })
  );
}

export async function onBrwoseChat(userMessage: string) {
  if (!Boolean(userMessage)) return;
  // browse chat logic

  state.chatHistory.push(
    new HumanMessage({
      content: userMessage,
    })
  );
}

export async function onChatResponseWithLoader(aiChtResponse: Function) {
  const spinner = ora({
    text: chalk.bold.hex("#ff66ff")("Summoning the neural abyss..."),
    spinner: "dots2",
    discardStdin: false,
  }).start();

  const output = await aiChtResponse();

  spinner.succeed(chalk.bold.hex("#66ff66")("Neural beast tamed."));

  if (state.isAiQuestion) {
    console_out(chalk.bold.green("AI Question:") + " " + chalk.italic(output));
  } else {
    console_out(chalk.bold.red("AI Answer:") + " " + chalk.italic(output));
  }

  // Continue with the user turn
  userMessageTurn();
}

export async function aiMessageTurn(message: string) {
  // reset ai message
  state.isAiQuestion = true;
  state.aiMessage = message;
  state.isUserPrompt = false;
}
function userMessageTurn() {
  state.isAiQuestion = false;
  state.aiMessage = "";
  state.isUserPrompt = true;
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
  // ai message handled in onAiResearchQuestion
  if (!state.isAiQuestion && Boolean(fullResponse)) {
    state.chatHistory.push(new AIMessage({ content: fullResponse }));
    const output = await marked.parse(fullResponse);
    return output;
  } else if (Boolean(state.aiMessage)) {
    state.chatHistory.push(new AIMessage({ content: state.aiMessage }));
    return state.aiMessage;
  }
  return;
}
