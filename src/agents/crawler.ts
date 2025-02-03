import { llm } from "../config";
import { CrawlSufficientResponseParser } from "../schemas/crawl";
import { crawlTool } from "../tools/crawl";

import createAgent from "../utils/agent";

export const crawlAgent = await createAgent({
  llm: llm,
  tools: [crawlTool], // crawl tool
  systemMessage: `
      you should call the crawled tool until the crawled content is sufficient for the task description.
      ${CrawlSufficientResponseParser.getFormatInstructions()}
  `,
});
