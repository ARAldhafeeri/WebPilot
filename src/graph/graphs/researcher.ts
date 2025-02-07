import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import {
  hlResearchTaskerNode,
  reportResearchNode,
  searchToolNode,
} from "../nodes";
import { NODE_NAMES } from "../../config/names";

const researcherNodeName = NODE_NAMES.hlResearchTasker;

const researchWorkflow = new StateGraph(AppState)
  .addNode(NODE_NAMES.hlResearchTasker, hlResearchTaskerNode)
  .addNode(NODE_NAMES.reporter, reportResearchNode)
  .addNode("call_tool", searchToolNode)
  // Start with the researcher agent
  .addEdge(START, NODE_NAMES.hlResearchTasker)
  .addConditionalEdges(NODE_NAMES.hlResearchTasker, router, {
    continue: NODE_NAMES.reporter,
    end: NODE_NAMES.reporter,
    call_tool: "call_tool",
  })
  // Instead of directly moving from reporter to END,
  // add a conditional edge that checks if the reporter output is empty.
  .addConditionalEdges(
    NODE_NAMES.reporter,
    (state) => {
      // Get the most recent message from state
      const lastMessage = state.messages[state.messages.length - 1];
      // If the message content exists and is not just whitespace, return "non_empty"
      if (
        typeof lastMessage.content === "string" &&
        lastMessage.content.trim() !== ""
      ) {
        return "non_empty";
      }
      // Otherwise, return "empty" so that the reporter node is re-invoked
      return "empty";
    },
    {
      empty: NODE_NAMES.reporter, // Loop back to reporter if output is empty
      non_empty: END, // Otherwise, finish the workflow
    }
  )

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
