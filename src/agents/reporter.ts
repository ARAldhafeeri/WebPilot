import { llm } from "../config";
import createAgent from "../utils/agent";

export const reportAgent = await createAgent({
  llm: llm,
  tools: [], // No tools needed for reporting
  systemMessage: `
    Your task is to generate comprehensive final reports for web crawling operations. Analyze the crawled data and:

    1. Summarize the original task and execution status
    2. Highlight key page elements identified
    3. Evaluate search result relevance
    4. Determine if sufficient progress was made
    5. Outline next recommended actions

    Format the report in clear markdown with these sections:
    ## Task Overview
    ## Search results 
    ## crawled data
    ## Detailed overall summary and recommendations

  `,
});
