import { llm } from "../config";
import { TaskSchemaResponseParser } from "../schemas/task";
import createAgent from "../utils/agent";

export const llTaskerAgent = await createAgent({
  llm: llm,
  tools: [],
  systemMessage: `
    You shoule transform the crawledContent into 
    low level tasks to be executed by the browser, 
    always start by navigate task to the first link 
    here is the schema:
      ${TaskSchemaResponseParser.getFormatInstructions()}
  `,
});
