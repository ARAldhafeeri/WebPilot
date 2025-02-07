import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import { hlCrawlTaskerNode, reportCrawlhNode } from "../nodes";
import { NODE_NAMES } from "../../config/names";

const crawlWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.hlCrawlTasker, hlCrawlTaskerNode)
  .addNode(NODE_NAMES.reporter, reportCrawlhNode);

crawlWorkflow
  .addEdge(START, NODE_NAMES.hlCrawlTasker)
  .addEdge(NODE_NAMES.hlCrawlTasker, NODE_NAMES.reporter)
  .addEdge(NODE_NAMES.reporter, END);

export default crawlWorkflow;
