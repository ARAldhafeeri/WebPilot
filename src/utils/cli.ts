import { NODE_NAMES } from "../config/names";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer() as unknown as any,
});
/**
 * save the output to markdown file
 * @param output ai output
 */
export function prettifyOutput(output: Record<string, any>) {
  const keys = Object.keys(output);
  const firstItem = output[keys[0]];

  if (!firstItem) return;

  if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
    const lastMessage = firstItem.messages[firstItem.messages.length - 1];
    if ("sender" in firstItem && firstItem["sender"] == NODE_NAMES.reporter) {
      if (lastMessage.content) {
        console.log(marked.parse(lastMessage.content));
      }
    }
  }
}
