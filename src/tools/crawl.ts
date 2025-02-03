import { chromium } from "playwright";
import { selectorService } from "../services";
import { AppState } from "../graph/state";
import { tool } from "@langchain/core/tools";

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
  async (state: typeof AppState.State): Promise<void> => {
    /**
     * crawl the site until the a.i has enough links, data to perform the task.
     */

    if (
      !state.linksQueue.includes({
        url: state.highLevelTask.urls[0],
        depth: 1,
      }) &&
      !state.crawledFirstUrl
    ) {
      state.linksQueue.push({ url: state.highLevelTask.urls[0], depth: 1 });
      state.crawledFirstUrl = true;
    }

    const foundLinks = [];
    try {
      while (state.linksQueue?.length > 0) {
        // get current link in queue
        const link = state.linksQueue.shift();

        if (!link) break;

        const { url, depth } = link;

        // extract text from url and links
        const { extracted, links } = await visitPage(link.url);
        state.taskContext.set(url, extracted);

        state.visited.add(url);
        // add links if ai call this tool again.
        links.forEach((newUrl) =>
          foundLinks.push({ url: newUrl, depth: depth + 1 })
        );
      }

      // if ai calls the tool again he will use state.links from pervious page
    } catch (error) {
      // console.log(`Error crawling website ${error}`);
    }
  },
  {
    name: "crawl_website",
    description: "crawl website and update state for crawler agent",
  }
);
