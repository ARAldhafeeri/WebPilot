import { llm } from "../config";
import { TaskSchemaResponseParser } from "../schemas/task";
import { executorTool } from "../tools/executor";

import createAgent from "../utils/agent";

export const executorAgent = await createAgent({
  llm: llm,
  tools: [executorTool], // Executor tool
  systemMessage: `
    Your task is to execute all tasks listed under currentTask by calling the browser_executor tool.  
    Follow this schema for formatting the results:  
    ${TaskSchemaResponseParser.getFormatInstructions()}
  `,
});
