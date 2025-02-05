import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { SEARCH_RESULTS } from "../getEnv";
import { tool } from "@langchain/core/tools";

import { aiMessageTurn } from "../cli/chats";
export const searchTool = new TavilySearchResults({
  maxResults: SEARCH_RESULTS,
});

export const researcherQuestionTool = tool(
  async (aiMessage: string) => {
    await aiMessageTurn(aiMessage);
    return aiMessage;
  },
  {
    name: "researchQuestionTool",
    description: "ask the user question about their research.",
  }
);
