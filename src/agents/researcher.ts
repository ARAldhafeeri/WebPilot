import { llm } from "../config";
import { SearchResultSchemaParser } from "../schemas/task";
import { searchTool } from "../tools/search";
import createAgent from "../utils/agent";

export const researchAgent = await createAgent({
  llm: llm,
  tools: [searchTool],
  systemMessage: `
    The high level tasker will send search tasks
    your task is to research and then return the results
    adhered to the following schema : 
    your search results must be an array of the following object
    {
      title: "name",
      url: "url",
      description: "description.
    }
    ${SearchResultSchemaParser.getFormatInstructions()}
  `,
});
