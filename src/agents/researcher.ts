import { llm } from "../config";
import { SearchResultSchemaParser } from "../schemas/task";
import { searchTool } from "../tools/search";
import createAgent from "../utils/agent";

export const researchAgent = await createAgent({
  llm: llm,
  tools: [searchTool],
  systemMessage: `
    Your task is to conduct research strictly using the searchTool.  
    Follow this schema for formatting the results:  
    ${SearchResultSchemaParser.getFormatInstructions()}
  `,
});
