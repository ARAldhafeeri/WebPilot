import { Task } from "../schemas/task";

type Urls = string[];

export interface ICrawler {
  crawlWebsite(urls: Urls, highLevelTaskDescription: string): Promise<void>;
  visitPage(url: string): Promise<{ extractedText: string; links: Urls }>;
}
