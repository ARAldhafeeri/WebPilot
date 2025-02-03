import { chromium } from "playwright";
import { selectorService } from "../services";
import { AppState } from "../graph/state";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

async function visitPage(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract relevant data based on the task description
    const extractedContent = await selectorService.getInteractableElements(
      page
    );

    // Find new links to follow
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a"))
        .map((a) => a.href)
        .filter((href) => href.startsWith("http"))
    );

    return { extracted: JSON.stringify(extractedContent), links };
  } finally {
    await browser.close();
  }
}

export const crawlTool = tool(
  async (state: typeof AppState.State): Promise<any> => {
    /**
     * crawl the site until the a.i has enough links, data to perform the task.
     */
    const taskContext = new Map();

    let { extracted, links } = await visitPage(
      state?.highLevelTask?.urls[0] || (state as unknown as string)
    );

    let depth = 0;
    try {
      // use only 10 url per link
      while (depth < 10) {
        // get current link in queue
        const link = links.shift();

        if (!link) break;
        let data = await visitPage(link);

        // extract text from url and links
        taskContext.set(link, data.extracted);
        depth += 1;
      }

      return {
        crawlData: taskContext,
      };

      // if ai calls the tool again he will use state.links from pervious page
    } catch (error) {
      // console.log(`Error crawling website ${error}`);
    }
  },
  {
    name: "crawl_website",
    description: "call to crawl url",
  }
);
