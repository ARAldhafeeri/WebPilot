import { Page } from "playwright";
import { Task } from "../schemas/task";

export interface INavigator {
  navigateAndProcess(
    page: Page,
    url: string,
    task: Task,
    depth: number
  ): Promise<void>;
  extractValidLinks(page: Page): Promise<string[]>;
  processPageLinks(page: Page, task: Task, depth: number): Promise<void>;
}
