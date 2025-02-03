import { llm } from "../config";
import { CrawlSufficientResponseParser } from "../schemas/crawl";
import { crawlTool } from "../tools/crawl";

import createAgent from "../utils/agent";

export const crawlAgent = await createAgent({
  llm: llm,
  tools: [crawlTool], // Crawl tool
  systemMessage: `
    Your task is to retrieve content by calling the crawl_website tool.  
    Tool name: crawl_website  
    Follow this schema for formatting the results:  
    ${CrawlSufficientResponseParser.getFormatInstructions()}
  `,
});
