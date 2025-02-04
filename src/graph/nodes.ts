import { RunnableConfig } from "@langchain/core/runnables";
import { runAgentNode } from "../utils/agent";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AppState } from "./state";
import {
  hlBrowserTasker,
  hlCrawlTasker,
  hlResearchTasker,
} from "../agents/hltasker";
import { llTaskerAgent } from "../agents/lltasker";

import { NODE_NAMES } from "../config/names";
import { reportAgent } from "../agents/reporter";
import { searchTool } from "../tools/search";
import { crawlTool } from "../tools/crawl";
import { executorTool } from "../tools/executor";
// high level task generation nodes
export async function hlBrowserTaskerNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: hlBrowserTasker,
    name: NODE_NAMES.hlBrowserTasker,
    config,
  });
}

export async function hlCrawlTaskerNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: hlCrawlTasker,
    name: NODE_NAMES.hlCrawlTasker,
    config,
  });
}

export async function hlResearchTaskerNode(
  state: typeof AppState.State,
  config?: RunnableConfig
) {
  return runAgentNode({
    state: state,
    agent: hlResearchTasker,
    name: NODE_NAMES.hlResearchTasker,
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
    name: NODE_NAMES.lltasker,
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
    name: NODE_NAMES.reporter,
    config,
  });
}

export const searchToolNode = new ToolNode([searchTool]);

export const executeToolNode = new ToolNode([executorTool]);
