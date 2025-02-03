import { llm } from "../config";
import { HighLevelTaskSchemaParser } from "../schemas/task";
import createAgent from "../utils/agent";

export const hlTaskerAgent = await createAgent({
  llm: llm,
  tools: [],
  systemMessage: `
  You are a High-Level Task Generator AI. Always provide a detailed description
  , urls, search query of the users input
  you should respond with the following schema always: 
    ${HighLevelTaskSchemaParser.getFormatInstructions()} 
  `,
});
