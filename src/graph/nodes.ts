import { RunnableConfig } from "@langchain/core/runnables";
import { researchAgent } from "../agents/researcher";
import { runAgentNode } from "../utils/agent";
import { AppState } from "./state";
import { hlTaskerAgent } from "../agents/hltasker";
import { llTaskerAgent } from "../agents/lltasker";
import { crawlAgent } from "../agents/crawler";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { searchTool } from "../tools/search";
import { executorAgent } from "../agents/executor";
import { AGENT_NAMES } from "../agents/names";
import { crawlTool } from "../tools/crawl";
import { reportAgent } from "../agents/reporter";
import { executorTool } from "../tools/executor";

// research node
export async function researchNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: researchAgent,
    name: AGENT_NAMES.researcher,
    config,
  });
}

// high level task generation node
export async function highLevelTasksNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: hlTaskerAgent,
    name: AGENT_NAMES.hltasker,
    config,
  });
}

// low level task generation node
export async function lowLevelTasksNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: llTaskerAgent,
    name: AGENT_NAMES.lltasker,
    config,
  });
}

// crawler node
export async function crawlerNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: crawlAgent,
    name: AGENT_NAMES.crawler,
    config,
  });
}

// executor node
export async function executorNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: executorAgent,
    name: AGENT_NAMES.executor,
    config,
  });
}
export async function reportNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: reportAgent,
    name: AGENT_NAMES.reporter,
    config,
  });
}
// tool node
const tools = [searchTool, crawlTool, executorTool];
// This runs tools in the graph
export const toolNode = new ToolNode<typeof AppState.State>(tools);
