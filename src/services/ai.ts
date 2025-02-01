import {
  HighLevelTask,
  HighLevelTaskSchemaParser,
  Task,
  TaskSchemaResponseParser,
} from "../schemas/task";
import { WebPilotModel } from "../types/models";
import { IWebPilotClient } from "../types/config";
import { IAiService } from "../types/ai"; // Adjust import path
import { SystemMessage } from "@langchain/core/messages";
import {
  AUTOMATION_ORCHESTRATOR_SYSTEM_MESSAGE,
  EXTRACT_HIGH_LEVEL_TASK_SYSTEM_MESSAGE,
  SMART_CRAWLER_SYSTEM_MESSAGE,
} from "../config/systemMessage";
import { CrawlSufficientResponseParser } from "../schemas/crawl";
import { webPilotInfo } from "../config/communicator";

export class AIService implements IAiService {
  // Explicit interface implementation
  private model: WebPilotModel;

  constructor(protected webPilotClient: IWebPilotClient) {
    this.model = webPilotClient.getModel();
  }

  async getHighLevelTask(userPrompt: string): Promise<HighLevelTask> {
    if (this.model === null) throw new Error("Model is not defined!");

    const messages = [
      new SystemMessage(EXTRACT_HIGH_LEVEL_TASK_SYSTEM_MESSAGE(userPrompt)),
    ];

    const raw = await this.model.invoke(messages);

    const res = HighLevelTaskSchemaParser.parse(raw.content as string);

    webPilotInfo("I am done creating high level task descriptions.");

    return res;
  }

  async hasSufficientDataForTask(
    highLevelTaskDescription: string,
    taskContext: string
  ) {
    if (this.model === null) throw new Error("Model is not defined!");
    const messages = [
      new SystemMessage(
        SMART_CRAWLER_SYSTEM_MESSAGE(highLevelTaskDescription, taskContext)
      ),
    ];

    const raw = await this.model.invoke(messages);

    const res = await CrawlSufficientResponseParser.parse(
      raw.content as string
    );

    webPilotInfo(
      `I think the data is ${
        res.isRelevant ? "relevant" : "irrelavent"
      } and the fetched data so far ${
        res.isSufficient
          ? "sufficient no more crawling needed."
          : "insufficient need to crawl more."
      }`
    );

    return res;
  }

  async generateTasksAndActions(
    highLevelTaskDescription: string,
    siteMap: string
  ): Promise<Task> {
    if (this.model === null) throw new Error("Model is not defined!");
    const messages = [
      new SystemMessage(
        AUTOMATION_ORCHESTRATOR_SYSTEM_MESSAGE(
          highLevelTaskDescription,
          siteMap
        )
      ),
    ];

    const raw = await this.model.invoke(messages);

    const res = await TaskSchemaResponseParser.parse(raw.content as string);
    webPilotInfo(
      "I determined the needed tasks and actions to complete the task."
    );
    return res;
  }
}
