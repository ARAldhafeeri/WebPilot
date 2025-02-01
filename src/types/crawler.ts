import { Task } from "../schemas/task";

export interface ICrawler {
  crawlWebsite(task: Task): Promise<void>;
}
