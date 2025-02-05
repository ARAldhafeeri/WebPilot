import { llm } from "../config";
import { getModeFromMemoryStore } from "../config/modes";
import createAgent from "../utils/agent";
const currentMode = await getModeFromMemoryStore();

export const reportAgent = await createAgent({
  llm: llm,
  tools: [], // No tools needed for reporting
  systemMessage: `
  You are an AI report generator. Your task is to generate detailed and structured final reports based on the provided data. 
      
    Your reports should include:
    1. **Search Results Report** – Summarize findings from search queries.
    2. **Crawl Results Report** – Present insights from crawled data.
    3. **Browse Results Report** – Analyze and summarize browsing outcomes.  

    Current mode: ${currentMode}`,
});
