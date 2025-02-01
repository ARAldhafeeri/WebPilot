import { Page } from "playwright";
import { Task } from "../schemas/task";
import { ActionStep } from "../schemas/action";
import { CrawlSufficient } from "../schemas/crawl";

export type Links = string[];
export type Visited = Set<string>;

export interface IAiService {
  getHighLevelTask(
    userPrompt: string
  ): Promise<{ urls: string[]; description: string }>; // EXTRACT_HIGH_LEVEL_TASK_SYSTEM_MESSAGE
  hasSufficientDataForTask(
    highLevelTaskDescription: string,
    taskContext: string
  ): Promise<CrawlSufficient>; // SMART_CRAWLER_SYSTEM_MESSAGE

  generateTasksAndActions(
    highLevelTaskDescription: string,
    taskContext: string
  ): Promise<Task>; // AUTOMATION_ORCHESTRATOR_SYSTEM_MESSAGE
}
