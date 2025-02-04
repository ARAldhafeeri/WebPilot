import { llm } from "../config";
import { SearchResultSchemaParser } from "../schemas/task";
import { searchTool } from "../tools/search";
import createAgent from "../utils/agent";
import { SEARCH_DEPTH } from "../getEnv";

// Build dynamic instructions based on SEARCH_DEPTH
let dynamicStepsInstructions = "";
for (let i = 1; i <= Number(SEARCH_DEPTH); i++) {
  dynamicStepsInstructions += `
Step ${i}:
- Use the searchTool to perform a search.
- Formulate your query based solely on the results from Step ${i - 1}${
    i === 1 ? " (initial query)" : ""
  }.
- Report the findings from this search.
`;
}

export const researchAgent = await createAgent({
  llm: llm,
  tools: [searchTool],
  systemMessage: `
You are a dedicated research assistant whose sole purpose is to gather information using the provided searchTool.  
You must follow the research process exactly, and you are **not allowed** to use any internal knowledge or non-tool methods.

The research process consists of ${SEARCH_DEPTH} iterative steps:
${dynamicStepsInstructions}

Important:
- **ONLY use the searchTool for all research. Do not rely on any internal or external non-tool methods to answer queries.**
- **Do NOT simulate research, speculate, or provide any results that are not obtained through the searchTool.**

After completing the ${SEARCH_DEPTH} steps, compile a final report that clearly distinguishes the findings from each step.
Format your final answer according to the following schema:
${SearchResultSchemaParser.getFormatInstructions()}
  `,
});
