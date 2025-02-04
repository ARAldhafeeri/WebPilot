import { END, START, StateGraph } from "@langchain/langgraph";
import { router } from "../router";
import { AppState } from "../state";
import { reportNode, researchNode, toolNode } from "../nodes";
import { AGENT_NAMES } from "../../agents/names";

/**
 * Research Graph:
 *   - Starts with the SearchAgent (researcher).
 *   - Uses a conditional edge to loop back (if needed) until the router decides that enough search results have been retrieved.
 *   - Then routes to the ReporterAgent.
 */
const researcherAgentName = AGENT_NAMES.researcher;

const researchWorkflow = new StateGraph(AppState)
  .addNode(AGENT_NAMES.researcher, researchNode)
  .addNode(AGENT_NAMES.reporter, reportNode)
  .addNode("call_tool", toolNode)
  // Start with the researcher agent
  .addEdge(START, AGENT_NAMES.researcher)
  // Ask the router if we need more search results or if we should finish
  .addConditionalEdges(AGENT_NAMES.researcher, router, {
    continue: AGENT_NAMES.reporter,
    end: END,
    call_tool: "call_tool",
  })
  .addEdge(AGENT_NAMES.reporter, END)
  .addConditionalEdges(
    "call_tool",
    // Each agent node updates the 'sender' field
    // the tool calling node does not, meaning
    // this edge will route back to the original agent
    // who invoked the tool
    (x) => x.sender,
    {
      [researcherAgentName]: AGENT_NAMES.researcher,
    }
  );

export default researchWorkflow;
