import { Page } from "playwright";
import { Task } from "../schemas/task";
import { ActionStep } from "../schemas/action";

export type Links = string[];
export type Queue = { url: string; depth: number }[];
export type Visited = Set<string>;

export interface IAiService {
  processContent(content: string, page: Page): Promise<void>;
  isContentRelevant(content: string, task: Task): Promise<Boolean>;
  prioritizeLinks(links: Links, task: Task): Promise<Links>;
  hasSufficientData(task: Task): Promise<Boolean>;
  generateActions(content: string, objective: string): Promise<ActionStep[]>;
}
