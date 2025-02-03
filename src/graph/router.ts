import { AIMessage } from "@langchain/core/messages";
import { AppState } from "./state";

export function router(state: typeof AppState.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
    return "call_tool";
  }

  if (
    typeof lastMessage.content === "string" &&
    lastMessage.content.includes("FINAL ANSWER")
  ) {
    // Any agent decided the work is done
    console.log("Researcher decision point:", state.sender);

    return "end";
  }
  console.log("Researcher decision point:", state.sender);

  return "continue";
}
