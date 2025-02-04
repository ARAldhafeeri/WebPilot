import { llm } from "../config";
import createAgent from "../utils/agent";

export const reportAgent = await createAgent({
  llm: llm,
  tools: [], // No tools needed for reporting
  systemMessage: `
    Your task is to generate comprehensive final reports your reports should be as follow :
    1. search results report based on the data.
    2. crawl results report based on the data.
    3. browse result report based on the data.

  `,
});
