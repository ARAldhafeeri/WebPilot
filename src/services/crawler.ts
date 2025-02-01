import { chromium, Browser, Page } from "playwright";
import { AIService } from "./ai";
import { Task } from "../schemas/task";
import { INavigator } from "../types/navigator";
import { ICrawler } from "../types/crawler";
import { IMemory } from "../types/memory";

export class Crawler implements ICrawler {
  constructor(
    private aiService: AIService,
    private maxDepth: number = 5,
    private navigator: INavigator,
    private memory: IMemory
  ) {}

  async crawlWebsite(task: Task): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: task.metadata?.userAgent,
      viewport: task.metadata?.viewport || { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    try {
      while (this.memory.lengthOfLinksQueue() > 0) {
        const link = this.memory.popFromLinksQueue();
        if (!link) break;
        const { url, depth } = link;

        if (this.memory.isLinkHasBeenVisited(url) || depth > this.maxDepth)
          continue;
        this.memory.addUrlToVisted(url);

        await this.navigator.navigateAndProcess(page, url, task, depth);

        if (await this.aiService.hasSufficientData(task)) break;
      }
    } finally {
      await browser.close();
    }
  }
}
