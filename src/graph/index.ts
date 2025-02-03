import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { router } from "./router";
import { AppState } from "./state";
import {
  crawlerNode,
  executorNode,
  highLevelTasksNode,
  lowLevelTasksNode,
  reportNode,
  researchNode,
  toolNode,
} from "./nodes";
import { AGENT_NAMES } from "../agents/names";

// 1. Create the graph
const workflow = new StateGraph(AppState)
  .addNode(AGENT_NAMES.hltasker, highLevelTasksNode)
  .addNode(AGENT_NAMES.researcher, researchNode)
  .addNode(AGENT_NAMES.lltasker, lowLevelTasksNode)
  .addNode(AGENT_NAMES.crawler, crawlerNode)
  .addNode(AGENT_NAMES.executor, executorNode)
  .addNode(AGENT_NAMES.reporter, reportNode)
  .addNode("call_tool", toolNode);

// // 2. define edges
// workflow.addEdge(AGENT_NAMES.hltasker, AGENT_NAMES.researcher);
workflow.addEdge(AGENT_NAMES.hltasker, AGENT_NAMES.researcher);

workflow.addConditionalEdges(AGENT_NAMES.researcher, router, {
  continue: AGENT_NAMES.crawler,
  call_tool: "call_tool",
  end: END,
});

workflow.addConditionalEdges(AGENT_NAMES.crawler, router, {
  continue: AGENT_NAMES.lltasker,
  call_tool: "call_tool",
  end: END,
});

workflow.addEdge(AGENT_NAMES.lltasker, AGENT_NAMES.executor);

workflow.addConditionalEdges(AGENT_NAMES.executor, router, {
  continue: AGENT_NAMES.reporter,
  call_tool: "call_tool",
  end: END,
});

workflow.addEdge(AGENT_NAMES.reporter, END);

const researcherAgentName = AGENT_NAMES.researcher;
const crawlerAgentName = AGENT_NAMES.crawler;
const executorAgentName = AGENT_NAMES.executor;

workflow.addConditionalEdges(
  "call_tool",
  // Each agent node updates the 'sender' field
  // the tool calling node does not, meaning
  // this edge will route back to the original agent
  // who invoked the tool
  (x) => x.sender,
  {
    [researcherAgentName]: AGENT_NAMES.researcher,
    [crawlerAgentName]: AGENT_NAMES.crawler,
    [executorAgentName]: AGENT_NAMES.executor,
  }
);

// // 3. conditional edge, agents with tools, should call a tool or continue
// workflow.addConditionalEdges(AGENT_NAMES.researcher, router, {
//   continue: AGENT_NAMES.crawler,
//   call_tool: "call_tool",
//   end: END,
// });

// workflow.addConditionalEdges(AGENT_NAMES.crawler, router, {
//   continue: AGENT_NAMES.lltasker,
//   call_tool: "call_tool",
//   end: END,
// });

// workflow.addEdge(AGENT_NAMES.lltasker, AGENT_NAMES.executor);

// workflow.addConditionalEdges(AGENT_NAMES.executor, router, {
//   call_tool: "call_tool",
//   end: END,
// });

workflow.addEdge(START, AGENT_NAMES.hltasker);

export const graph = workflow.compile();
