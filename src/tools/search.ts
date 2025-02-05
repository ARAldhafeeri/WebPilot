import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { SEARCH_RESULTS } from "../getEnv";
import { tool } from "@langchain/core/tools";
export const searchTool = new TavilySearchResults({
  maxResults: SEARCH_RESULTS,
});

export const researchQuestion = tool(async function(state))