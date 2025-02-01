import { chromium, Browser, Page } from "playwright";
import { AIService } from "./ai";
import { Task } from "../schemas/task";
import { INavigator } from "../types/navigator";
import { ICrawler } from "../types/crawler";

export class Crawler implements ICrawler {
  constructor(
    private aiService: AIService,
    private maxDepth: number = 5,
    private navigator: INavigator
  ) {}

  async crawlWebsite(task: Task): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: task.metadata?.userAgent,
      viewport: task.metadata?.viewport || { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    const visited = new Set<string>();
    const queue: { url: string; depth: number }[] = [
      { url: task.currentUrl, depth: 0 },
    ];

    try {
      while (queue.length > 0) {
        const { url, depth } = queue.shift()!;

        if (visited.has(url) || depth > this.maxDepth) continue;
        visited.add(url);

        await this.navigator.navigateAndProcess(
          page,
          url,
          task,
          depth,
          queue,
          visited
        );

        if (await this.aiService.hasSufficientData(task)) break;
      }
    } finally {
      await browser.close();
    }
  }
}
