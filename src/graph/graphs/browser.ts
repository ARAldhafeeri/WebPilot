import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import {
  crawlerNode,
  executorNode,
  highLevelTasksNode,
  lowLevelTasksNode,
  reportNode,
} from "../nodes";
import { AGENT_NAMES } from "../../agents/names";

const crawlerAgentName = AGENT_NAMES.crawler;
const executorAgentName = AGENT_NAMES.executor;

/**
 * Browse Graph:
 *   - Starts with the high-level task generator (hltasker) for generating high level description of browser tasks.
 *   - Proceeds crawler to crawl from the website.
 *   - the crawler will call the crawl tool until finishes crawling all needed selectors, data.
 *   - after crawler done crawling it will go for generating low level tasks which are tasks going to be executed by the browser executor.
 *   - the browser executor will determine if more tasks need to be executed it will call executeTool.
 *   - otherwise, it exists to reports with final answer
 */
const browseWorkflow = new StateGraph(AppState)
  .addNode(AGENT_NAMES.hltasker, highLevelTasksNode)
  .addNode(AGENT_NAMES.crawler, crawlerNode)
  .addNode(AGENT_NAMES.lltasker, lowLevelTasksNode)
  .addNode(AGENT_NAMES.executor, executorNode)
  .addNode(AGENT_NAMES.reporter, reportNode);

browseWorkflow
  .addEdge(START, AGENT_NAMES.hltasker)
  .addEdge(AGENT_NAMES.hltasker, AGENT_NAMES.crawler)
  .addConditionalEdges(AGENT_NAMES.crawler, router, {
    continue: AGENT_NAMES.crawler,
    call_tool: "call_tool",
    end: AGENT_NAMES.lltasker,
  })
  .addEdge(AGENT_NAMES.lltasker, AGENT_NAMES.executor)
  .addConditionalEdges(AGENT_NAMES.executor, router, {
    continue: AGENT_NAMES.executor,
    end: AGENT_NAMES.reporter,
    call_tool: "call_tool",
  })
  .addEdge(AGENT_NAMES.reporter, END)

  .addConditionalEdges(
    "call_tool",
    // Each agent node updates the 'sender' field
    // the tool calling node does not, meaning
    // this edge will route back to the original agent
    // who invoked the tool
    (x) => x.sender,
    {
      [executorAgentName]: AGENT_NAMES.executor,
      [crawlerAgentName]: AGENT_NAMES.crawler,
    }
  );

export default browseWorkflow;
