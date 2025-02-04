import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import {
  crawlerNode,
  executorNode,
  highLevelTasksNode,
  reportNode,
  toolNode,
} from "../nodes";
import { AGENT_NAMES } from "../../agents/names";

/**
 * Crawl Graph:
 *   - starts with high level tasker node, which will generate crawl high level task based on graph state.
 *   - then crawl site.
 *   - finally routes to the ReporterAgent to produce a report.
 */
const crawlWorkflow = new StateGraph(AppState)
  .addNode(AGENT_NAMES.hltasker, highLevelTasksNode)
  .addNode(AGENT_NAMES.crawler, crawlerNode)
  .addNode(AGENT_NAMES.reporter, reportNode)
  .addNode(AGENT_NAMES.executor, executorNode)
  .addNode("call_tool", toolNode)
  // Begin with crawling the website
  .addEdge(START, AGENT_NAMES.hltasker)
  .addEdge(AGENT_NAMES.hltasker, AGENT_NAMES.crawler)
  // Let the executor decide if more crawling is required
  .addConditionalEdges(AGENT_NAMES.executor, router, {
    continue: AGENT_NAMES.reporter,
    end: END,
    call_tool: "call_tool",
  })
  .addEdge(AGENT_NAMES.reporter, END);

const crawlerAgentName = AGENT_NAMES.crawler;

crawlWorkflow.addConditionalEdges(
  "call_tool",
  // Each agent node updates the 'sender' field
  // the tool calling node does not, meaning
  // this edge will route back to the original agent
  // who invoked the tool
  (x) => x.sender,
  {
    [crawlerAgentName]: AGENT_NAMES.crawler,
  }
);
export default crawlWorkflow;
