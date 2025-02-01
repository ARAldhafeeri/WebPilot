import { Task } from "../schemas/task";
import { IAiService } from "../types/ai";
import { IExecutor } from "../types/executor";
import { IMemory } from "../types/memory";
import { INavigator } from "../types/navigator";
import { Page } from "playwright";
import { linkCreator } from "../utils/helpers";

class Navigator implements INavigator {
  constructor(
    private aiService: IAiService,
    private executor: IExecutor,
    private memory: IMemory
  ) {}

  async navigateAndProcess(
    page: Page,
    url: string,
    task: Task,
    depth: number
  ): Promise<void> {
    try {
      await page.goto(url);
      await this.executor.executeActionSteps(task.steps, page);

      const content = await page.content();

      if (await this.aiService.isContentRelevant(content, task)) {
        await this.aiService.processContent(content, page);
        await this.processPageLinks(page, task, depth);
      }
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    }
  }

  async processPageLinks(page: Page, task: Task, depth: number) {
    const links = await this.extractValidLinks(page);
    let prioritized = await this.aiService.prioritizeLinks(links, task);

    for (const link of prioritized) {
      if (!this.memory.isLinkHasBeenVisited(link)) {
        this.memory.pushToLinksQueue(linkCreator(link, depth + 1));
      }
    }
  }

  async extractValidLinks(page: Page): Promise<string[]> {
    return page.evaluate(() =>
      Array.from(document.querySelectorAll("a"))
        .map((a) => a.href)
        .filter((href) => href?.startsWith("http"))
    );
  }
}

export default Navigator;
