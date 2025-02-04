import { llm } from "../config";
import {
  BrowserTaskSchemaParser,
  CrawlTaskSchemaParser,
  ResearchTaskSchemaParser,
} from "../schemas/task";
import createAgent from "../utils/agent";

// Research task describer (now only redescribes the task)
export const hlResearchTasker = await createAgent({
  llm: llm,
  tools: [],
  systemMessage: `
    You are a Research Task Describer AI.
    Your job is to simply restate the provided task in your own words.
    IMPORTANT: Do NOT generate links, crawl instructions, or perform any search.
    Only rephrase the task.
    Always respond using the following schema:
    ${ResearchTaskSchemaParser.getFormatInstructions()}
  `,
});

// Crawl task describer (now only redescribes the task)
export const hlCrawlTasker = await createAgent({
  llm: llm,
  tools: [],
  systemMessage: `
    You crawled data cleaner you will be passed some content, and user prompt
    perform the task for the user. 
  `,
});

// Browser task describer (now only redescribes the task)
export const hlBrowserTasker = await createAgent({
  llm: llm,
  tools: [],
  systemMessage: `
    You are a Browser Task Describer AI.
    Your task is to rephrase the provided browser automation task without adding any extra details like navigation URLs or crawl/search actions.
    Only provide a simple restatement of the task.
    Always respond using the following schema:
    ${BrowserTaskSchemaParser.getFormatInstructions()}
  `,
});
