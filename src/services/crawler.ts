import { chromium } from "playwright";
import { ICrawler } from "../types/crawler";
import { IMemory } from "../types/memory";
import { IAiService } from "../types/ai";

export class Crawler implements ICrawler {
  constructor(
    private aiService: IAiService,
    private maxDepth: number = 5,
    private memory: IMemory
  ) {}

  async visitPage(url: string) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Extract relevant data based on the task description
      const extractedText = await page.evaluate(() => document.body.innerText);

      // Find new links to follow
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a"))
          .map((a) => a.href)
          .filter((href) => href.startsWith("http"))
      );

      return { extractedText, links };
    } finally {
      await browser.close();
    }
  }

  async crawlWebsite(
    urls: string[],
    highLevelTaskDescription: string
  ): Promise<void> {
    /**
     * crawl the site until the a.i has enough links, data to perform the task.
     */

    for (let i = 0; i < urls.length; i++) {
      this.memory.pushToLinksQueue({ url: urls[0], depth: 0 });
    }

    try {
      while (this.memory.lengthOfLinksQueue() > 0) {
        // get current link in queue
        const link = this.memory.popFromLinksQueue();

        if (!link) break;

        const { url, depth } = link;

        // extract text from url and links
        const { extractedText, links } = await this.visitPage(link.url);

        // add to task context
        this.memory.addTaskContext(url, extractedText);

        if (this.memory.isLinkHasBeenVisited(url) || depth > this.maxDepth)
          continue;

        this.memory.addUrlToVisted(url);

        // if a.i reply true, we break and generate task, then execute.
        if (
          await this.aiService.hasSufficientDataForTask(
            highLevelTaskDescription,
            this.memory.getTaskContext()
          )
        ) {
          break;
        }

        // a.i need to visit more links and needs more data
        links.forEach((newUrl) =>
          this.memory.pushToLinksQueue({ url: newUrl, depth: depth + 1 })
        );
      }
    } catch (error) {
      console.log(`Error crawling website ${error}`);
    }
  }
}
