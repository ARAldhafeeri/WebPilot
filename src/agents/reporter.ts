import { llm } from "../config";
import { getModeFromMemoryStore } from "../config/modes";
import createAgent from "../utils/agent";
const currentMode = await getModeFromMemoryStore();

/**
 * Agent for generating the Search Results Report.
 * This agent is responsible for summarizing the findings from search queries.
 */
export const searchReportAgent = await createAgent({
  llm: llm,
  tools: [], // No tools needed for this reporting task
  systemMessage: `
You are an AI report generator specialized in creating the Search Results Report.
Your task is to generate a detailed and structured report that summarizes the findings from search queries.
Additional Requirements:
- **Always Return a Response:** Even if no search data is available, include a statement like "No data available for search results".
- **Plain Text Format:** Your output should be in plain text with clear headings.
`,
});

/**
 * Agent for generating the Crawl Results Report.
 * This agent is responsible for presenting insights derived from crawled data.
 */
export const crawlReportAgent = await createAgent({
  llm: llm,
  tools: [], // No tools needed for this reporting task
  systemMessage: `
You are an AI report generator specialized in creating the Crawl Results Report.
Your task is to generate a detailed and structured report that presents insights from crawled data.
Additional Requirements:
- **Always Return a Response:** Even if no crawled data is available, include a statement like "No data available for crawl results".
- **Plain Text Format:** Your output should be in plain text with clear headings.
`,
});

/**
 * Agent for generating the Browse Results Report.
 * This agent is responsible for analyzing and summarizing outcomes from browsing activities.
 */
export const browseReportAgent = await createAgent({
  llm: llm,
  tools: [], // No tools needed for this reporting task
  systemMessage: `
You are an AI report generator specialized in creating the Browse Results Report.
Your task is to generate a detailed and structured report that analyzes and summarizes outcomes from browsing activities.
Additional Requirements:
- **Always Return a Response:** Even if no browsing data is available, include a statement like "No data available for browse results".
- **Plain Text Format:** Your output should be in plain text with clear headings.
`,
});
