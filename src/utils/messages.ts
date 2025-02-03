// the following file have methods that turn the JSON result
// from each agent into a message and send it to the agent.
import { SystemMessage } from "@langchain/core/messages";
import { AGENT_NAMES } from "../agents/names";
import { AppState } from "../graph/state";
import { HighLevelTask } from "../schemas/task";

class AgentsMessageOrchestrator {
  messageResearcher(highLevelTask: HighLevelTask) {
    return [
      new SystemMessage({
        content: `High level task description: ${highLevelTask.description}
        Task stack: ${JSON.stringify(highLevelTask.searchTasks)}`,
      }),
    ];
  }

  orchestrator(state: typeof AppState.State) {
    switch (state.sender) {
      case AGENT_NAMES.hltasker:
        return state.highLevelTask
          ? this.messageResearcher(state.highLevelTask)
          : [];
      default:
        return [];
    }
  }
}

export const agentMessageOrchestrator = new AgentsMessageOrchestrator();
