import { Task } from "../schemas/task";
import { IAiService, Queue, Visited } from "../types/ai";
import { IExecutor } from "../types/executor";
import { INavigator } from "../types/navigator";
import { Page } from "playwright";

class Navigator implements INavigator {
  constructor(private aiService: IAiService, private executor: IExecutor) {}

  async navigateAndProcess(
    page: Page,
    url: string,
    task: Task,
    depth: number,
    queue: Queue,
    visited: Visited
  ): Promise<void> {
    try {
      await page.goto(url);
      await this.executor.executeActionSteps(task.steps, page);

      const content = await page.content();

      if (await this.aiService.isContentRelevant(content, task)) {
        await this.aiService.processContent(content, page);
        await this.processPageLinks(page, task, depth, queue, visited);
      }
    } catch (error) {
      console.error(`Error processing ${url}:`, error);
    }
  }

  async processPageLinks(
    page: Page,
    task: Task,
    depth: number,
    queue: { url: string; depth: number }[],
    visited: Visited
  ) {
    const links = await this.extractValidLinks(page);
    const prioritized = await this.aiService.prioritizeLinks(links, task);

    queue.push(
      ...prioritized
        .filter((link) => !visited.has(link))
        .map((link) => ({ url: link, depth: depth + 1 }))
    );
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
