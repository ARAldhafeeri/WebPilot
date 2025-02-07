import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import {
  executeToolNode,
  hlBrowserTaskerNode,
  lowLevelTasksNode,
  reportBrowseNode,
} from "../nodes";
import { NODE_NAMES } from "../../config/names";

const browseWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.lltasker, lowLevelTasksNode)
  // .addNode(NODE_NAMES.executorTool, executeToolNode)
  .addNode(NODE_NAMES.reporter, reportBrowseNode);

browseWorkflow
  .addEdge(START, NODE_NAMES.lltasker)
  .addEdge(NODE_NAMES.lltasker, NODE_NAMES.reporter)
  .addEdge(NODE_NAMES.reporter, END);

export default browseWorkflow;
