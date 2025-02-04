import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import { hlBrowserTaskerNode, lowLevelTasksNode, reportNode } from "../nodes";
import { NODE_NAMES } from "../../config/names";

const browseWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.hlBrowserTasker, hlBrowserTaskerNode)
  .addNode(NODE_NAMES.lltasker, lowLevelTasksNode)
  .addNode(NODE_NAMES.reporter, reportNode);

browseWorkflow
  .addEdge(START, NODE_NAMES.hlBrowserTasker)
  .addConditionalEdges(NODE_NAMES.hlBrowserTasker, router, {
    continue: NODE_NAMES.lltasker,
    end: END,
  })
  .addConditionalEdges(NODE_NAMES.reporter, router, {
    continue: END,
    end: END,
  });

export default browseWorkflow;
