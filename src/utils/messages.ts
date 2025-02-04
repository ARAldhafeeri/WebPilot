// the following file have methods that turn the JSON result
// from each agent into a message and send it to the agent.
import { SystemMessage } from "@langchain/core/messages";
import { NODE_NAMES } from "../config/names";
import { AppState } from "../graph/state";
import { HighLevelTask } from "../schemas/task";

class AgentsMessageOrchestrator {
  messageResearcher(highLevelTask: HighLevelTask) {
    return [
      {
        content: `High level task description: ${highLevelTask.description}
        Task stack: ${JSON.stringify(highLevelTask.searchTasks)}`,
        role: "system",
      },
    ];
  }

  orchestrator(state: typeof AppState.State) {
    switch (state.sender) {
      case NODE_NAMES.hltasker:
        return state.highLevelTask
          ? this.messageResearcher(state.highLevelTask)
          : [];
      default:
        return [];
    }
  }
}

export const agentMessageOrchestrator = new AgentsMessageOrchestrator();
