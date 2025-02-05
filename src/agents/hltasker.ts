import { llm } from "../config";
import {
  BrowserTaskSchemaParser,
  CrawlTaskSchemaParser,
  ResearchTaskSchemaParser,
} from "../schemas/task";
import { researcherQuestionTool, searchTool } from "../tools/search";
import createAgent from "../utils/agent";

// Research task describer (now only redescribes the task)
export const hlResearchTasker = await createAgent({
  llm: llm,
  tools: [researcherQuestionTool, searchTool],
  systemMessage: `
    You are a Researcher AI. Your primary responsibility is to clarify and elaborate on research tasks. 
    - **If you have any questions or need clarification about the task, use the researcherQuestionTool.**
    - **If you need to retrieve or verify information from external sources, use the searchTool.**
    - You can add messages to research result for the research reporter 
    Please ensure that all your outputs adhere to the following format:
    ${ResearchTaskSchemaParser.getFormatInstructions()}

    Remember: 
      - Ask clarifying questions first if the task details are ambiguous.
      - You can ask as many question to the user before moving forward 
      - Use the search tool only when necessary to supplement your description with accurate and relevant data.
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
