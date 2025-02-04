import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import { hlResearchTaskerNode, reportNode, searchToolNode } from "../nodes";
import { NODE_NAMES } from "../../config/names";

const researchWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.hlResearchTasker, hlResearchTaskerNode)
  .addNode(NODE_NAMES.researchTool, searchToolNode)
  .addNode(NODE_NAMES.reporter, reportNode)
  // Start with the researcher agent
  .addEdge(START, NODE_NAMES.hlResearchTasker)
  .addEdge(NODE_NAMES.hlResearchTasker, NODE_NAMES.researchTool)
  .addEdge(NODE_NAMES.researchTool, NODE_NAMES.reporter)
  .addEdge(NODE_NAMES.reporter, END);

export default researchWorkflow;
