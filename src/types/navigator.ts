import { Page } from "playwright";
import { Task } from "../schemas/task";
import { Queue, Visited } from "./ai";

export interface INavigator {
  navigateAndProcess(
    page: Page,
    url: string,
    task: Task,
    depth: number,
    queue: Queue,
    visited: Visited
  ): Promise<void>;
  extractValidLinks(page: Page): Promise<string[]>;
  processPageLinks(
    page: Page,
    task: Task,
    depth: number,
    queue: Queue,
    visited: Visited
  ): Promise<void>;
}
