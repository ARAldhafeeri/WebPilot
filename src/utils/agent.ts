import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StructuredTool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { Runnable } from "@langchain/core/runnables";
import { WebPilotModel } from "../types/models";
import type { RunnableConfig } from "@langchain/core/runnables";
import { AppState } from "../graph/state";
import {
  ResearchTaskSchemaParser,
  TaskSchemaResponseParser,
} from "../schemas/task";
import { NODE_NAMES } from "../config/names";
import { runExecutorTask } from "../tools/executor";

/**
 * Create an agent that can run a set of tools.
 */
async function createAgent({
  llm,
  tools,
  systemMessage,
}: {
  llm: WebPilotModel;
  tools: StructuredTool[];
  systemMessage: string;
}): Promise<Runnable> {
  if (!llm) throw new Error("llm must be defined!");
  const toolNames = tools.map((tool) => tool.name).join(", ");
  const formattedTools = tools.map((t) => convertToOpenAITool(t));

  let prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant, collaborating with other assistants." +
        " Use the provided tools to progress towards answering the question." +
        " If you are unable to fully answer, that's OK, another assistant with different tools " +
        " will help where you left off. Execute what you can to make progress." +
        " If you or any of the other assistants have the final answer or deliverable," +
        " prefix your response with FINAL ANSWER so the team knows to stop." +
        " You have access to the following tools: {tool_names}.\n{system_message}",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  prompt = await prompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
  });

  return prompt.pipe(llm.bind({ tools: formattedTools }));
}

export async function runAgentNode(props: {
  state: typeof AppState.State;
  agent: Runnable;
  name: string;
  config?: RunnableConfig;
}) {
  const { state, agent, name, config } = props;

  let result = await agent.invoke(state, config);
  let stateUpdates: Partial<typeof AppState.State> = {};

  // Handle parsed results
  switch (name) {
    case NODE_NAMES.hlResearchTasker:
      if (!result.tool_calls || result.tool_calls.length === 0) {
        try {
          stateUpdates.researchTask = await ResearchTaskSchemaParser.parse(
            result.content
          );
        } catch {}
      }
      break;
    case NODE_NAMES.lltasker:
      stateUpdates.currentTask = await TaskSchemaResponseParser.parse(
        result.content
      );
      runExecutorTask(stateUpdates.currentTask);
      break;
    default:
      break;
  }

  return {
    ...stateUpdates,
    messages: [...state.messages, result],
    sender: name,
  };
}

export default createAgent;
