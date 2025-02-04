import { chromium } from "playwright";
import { selectorService } from "../services";
import { AppState } from "../graph/state";
import { tool } from "@langchain/core/tools";
import { CRAWL_BASE, CRAWL_DEPTH } from "../getEnv";

/**
 * Visit a single page, extract relevant content, and find links.
 */
async function visitPage(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract relevant elements from the page.
    // You can customize the selectors inside the selectorService as needed.
    const extractedContent = await selectorService.getInteractableElements(
      page
    );

    // Extract links (only considering http/https links)
    const links = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a"))
        .map((a) => a.href)
        .filter((href) => href.startsWith("http"))
    );

    return { extracted: JSON.stringify(extractedContent), links };
  } catch (error) {
    console.error(`Error visiting page ${url}:`, error);
    return { extracted: "{}", links: [] };
  } finally {
    await browser.close();
  }
}

/**
 * Updated crawl tool with base and depth control.
 */
export const crawlTool = tool(
  async (state: typeof AppState.State): Promise<any> => {
    // Get the initial URL from state.
    const baseUrl =
      state?.highLevelTask?.urls[0] || (state as unknown as string);
    const visited = new Set<string>();
    const crawlResults = new Map<string, string>();

    /**
     * Recursive crawl function.
     * @param url - current URL to crawl.
     * @param currentDepth - current crawl level.
     */
    async function crawl(url: string, currentDepth: number): Promise<void> {
      // Stop if the maximum depth is reached or URL is already visited.
      if (currentDepth > Number(CRAWL_DEPTH) || visited.has(url)) return;
      visited.add(url);

      try {
        const { extracted, links } = await visitPage(url);
        crawlResults.set(url, extracted);

        // Only continue crawling if we haven't reached the max depth.
        if (currentDepth < Number(CRAWL_DEPTH)) {
          // Limit to CRAWL_BASE number of links.
          const limitedLinks = links.slice(0, Number(CRAWL_BASE));
          for (const link of limitedLinks) {
            await crawl(link, currentDepth + 1);
          }
        }
      } catch (error) {
        console.error(`Error crawling ${url}:`, error);
      }
    }

    // Begin crawling from the base URL.
    await crawl(baseUrl, 1);

    return { crawlData: crawlResults };
  },
  {
    name: "crawl_website",
    description:
      "Crawls a website extracting Title, Headings, Body Text, Meta Descriptions, and Links (including research references). The crawl depth and base are controlled by CRAWL_BASE and CRAWL_DEPTH.",
  }
);
