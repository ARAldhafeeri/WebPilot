import { AIMessage } from "@langchain/core/messages";
import { AppState } from "./state";

export function router(state: typeof AppState.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    return "call_tool";
  }

  // // if the workflow is search invoke the tool
  // if (state.sender === NODE_NAMES.hltasker) {
  // }

  if (
    typeof lastMessage.content === "string" &&
    lastMessage.content.includes("FINAL ANSWER")
  ) {
    return "end";
  }

  return "continue";
}
