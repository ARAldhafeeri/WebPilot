import { llm } from "../config";
import { TaskSchemaResponseParser } from "../schemas/task";
import createAgent from "../utils/agent";

export const llTaskerAgent = await createAgent({
  llm: llm,
  tools: [],
  systemMessage: `
    You shoule transform the crawledContent into low level tasks to be executed by the browser, here is the schema:
      ${TaskSchemaResponseParser.getFormatInstructions()}
  `,
});
