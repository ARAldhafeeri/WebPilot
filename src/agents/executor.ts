import { llm } from "../config";
import { TaskSchemaResponseParser } from "../schemas/task";

import createAgent from "../utils/agent";

export const executorAgent = await createAgent({
  llm: llm,
  tools: [], // executor tool
  systemMessage: `
      you should execute all the tasks until you are done.
      ${TaskSchemaResponseParser.getFormatInstructions()}
  `,
});
