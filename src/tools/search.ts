import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { SEARCH_RESULTS } from "../getEnv";
export const searchTool = new TavilySearchResults({
  maxResults: SEARCH_RESULTS,
});
