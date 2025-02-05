import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import { hlResearchTaskerNode, reportNode, searchToolNode } from "../nodes";
import { NODE_NAMES } from "../../config/names";

const researcherNodeName = NODE_NAMES.hlResearchTasker;

const researchWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.hlResearchTasker, hlResearchTaskerNode)
  .addNode(NODE_NAMES.reporter, reportNode)
  .addNode("call_tool", searchToolNode)
  // Start with the researcher agent
  .addEdge(START, NODE_NAMES.hlResearchTasker)
  .addConditionalEdges(NODE_NAMES.hlResearchTasker, router, {
    continue: NODE_NAMES.reporter,
    end: NODE_NAMES.reporter,
    call_tool: "call_tool",
  })
  .addEdge(NODE_NAMES.reporter, END)

  .addConditionalEdges(
    "call_tool",
    // Each agent node updates the 'sender' field
    // the tool calling node does not, meaning
    // this edge will route back to the original agent
    // who invoked the tool
    (x) => x.sender,
    {
      [researcherNodeName]: NODE_NAMES.hlResearchTasker,
    }
  );

export default researchWorkflow;
