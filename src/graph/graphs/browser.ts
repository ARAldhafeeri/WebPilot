import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import { hlBrowserTaskerNode, lowLevelTasksNode, reportNode } from "../nodes";
import { NODE_NAMES } from "../../config/names";

const browseWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.lltasker, lowLevelTasksNode) // add browse tool.
  .addNode(NODE_NAMES.reporter, reportNode);

browseWorkflow
  .addEdge(START, NODE_NAMES.lltasker)
  .addEdge(NODE_NAMES.lltasker, NODE_NAMES.reporter);

export default browseWorkflow;
