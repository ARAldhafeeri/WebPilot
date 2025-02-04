import { chromium } from "playwright";
import { selectorService } from "../services";

/**
 * Visit a single page, extract relevant content, and find links.
 */
async function visitPage(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Extract text content and links from the page
  const extracted = await selectorService.getInteractableElements(page);
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((a: any) => a.href)
  );

  await browser.close();
  return { extracted, links };
}

/**
 * Updated crawl tool with base and depth control.
 */
export const crawlTool = async (
  depth: number,
  url: string,
  base: number
): Promise<any> => {
  // Get the initial URL from state.
  const visited = new Set();
  const crawlResults: Map<string, any> = new Map();
  const queue: Array<{ depth: number; url: string }> = [{ depth, url }];
  while (queue.length > 0) {
    const { url, depth: currentDepth } = queue.shift() || {
      depth: 0,
      url: "",
    };
    if (currentDepth > depth || visited.has(url)) continue;

    console.log(`Visiting: ${url} (Depth: ${currentDepth})`);
    visited.add(url);

    try {
      const { extracted, links } = await visitPage(url);
      crawlResults.set(url, extracted);

      // Limit links and track depth
      const limitedLinks = links.slice(0, base);
      for (const link of limitedLinks) {
        if (!visited.has(link)) {
          queue.push({ url: link, depth: currentDepth + 1 });
        }
      }
    } catch (error) {
      console.error(`Error visiting ${url}`);
    }
  }
  return {
    crawlData: { pages: crawlResults },
  };
};
