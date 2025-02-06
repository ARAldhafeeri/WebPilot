import { chromium } from "playwright";
import chalk from "chalk";
import { replacer } from "../utils/crawl";

export const INTERACTABLE_ELEMENTS = [
  "a[href]",
  "button",
  'input:not([type="hidden"])',
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[contenteditable="true"]',
];


class Selector {
  async getInteractableElements(page) {
    const locator = page.locator(INTERACTABLE_ELEMENTS.join(","));
    const elementLocators = await locator.all();
    const elementDescriptions = [];

    for (const elementLocator of elementLocators) {
      let selector = null;
      let text = null;
      let tagName = null;
      let canPush = false;
      try {
        selector = await this.getSelector(elementLocator);
        text = await elementLocator.evaluate((el) =>
          (el.textContent || el.getAttribute("aria-label") || "").trim()
        );
        tagName = await elementLocator.evaluate((el) =>
          el.tagName.toLowerCase()
        );
        canPush = true;
      } catch {
        canPush = false;
      }
      if (canPush) {
        elementDescriptions.push({ selector, text, tagName });
      }
    }

    return elementDescriptions;
  }
  async getSelector(elementLocator) {
    return elementLocator.evaluate((element) => {
      const escape = (str) => CSS.escape(str);

      function getChildSelector(el, parent) {
        const tag = el.tagName.toLowerCase();
        const index = Array.from(parent.children)
          .filter(child => child.tagName === el.tagName)
          .indexOf(el) + 1;

        if (el.className) {
          const classes = el.className.split(/\s+/).filter(c => c.length);
          return `${tag}.${escape(classes[0])}`;
        }

        return index > 1 ? `${tag}:nth-child(${index})` : tag;
      }

      function getFallbackSelector(el) {
        const path = [];
        let current = el;

        while (current && current.nodeType === Node.ELEMENT_NODE && path.length < 3) {
          let selector = current.tagName.toLowerCase();
          if (current.className) {
            const classes = current.className.split(/\s+/).filter(c => c.length);
            if (classes.length) selector += `.${escape(classes[0])}`;
          }
          path.unshift(selector);
          current = current.parentElement;
        }
        return path.join(" > ");
      }

      if (element.id) return `#${escape(element.id)}`;

      if (element.className) {
        const classes = element.className.split(/\s+/).filter(c => c.length);
        for (const cls of classes) {
          const selector = `${element.tagName.toLowerCase()}.${escape(cls)}`;
          if (document.querySelectorAll(selector).length === 1) return selector;
        }
      }

      const name = element.getAttribute("name");
      if (name) {
        const selector = `${element.tagName.toLowerCase()}[name="${escape(name)}"]`;
        if (document.querySelectorAll(selector).length === 1) return selector;
      }

      const parentWithId = element.closest("[id]");
      if (parentWithId) {
        const childSelector = getChildSelector(element, parentWithId);
        return `#${escape(parentWithId.id)} ${childSelector}`;
      }

      const tagSelector = element.tagName.toLowerCase();
      if (document.querySelectorAll(tagSelector).length === 1) return tagSelector;

      return getFallbackSelector(element);
    });
  }
}

const selectorService = new Selector();

/**
 * Visit a single page, extract relevant content, and find links.
 */
async function visitPage(url, page) {
  await page.goto(url);
  await page.waitForLoadState();

  // Extract text content and links from the page
  const extracted = await selectorService.getInteractableElements(page);
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((a) => a.href)
  );

  return { extracted, links };
}

/**
 * Updated crawl tool with base and depth control.
 */
export const crawlTool = async (maxDepth, url, base) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log(
    chalk.cyan.bold(`\n🌐 Starting crawl at: ${chalk.underline(url)}`)
  );
  console.log(
    chalk.gray(`🔍 Depth Limit: ${maxDepth} | Max Links Per Page: ${base}\n`)
  );

  const visited = new Set();
  const crawlResults = new Map();
  const queue = [{ depth: maxDepth, url }];
  
  while (Boolean(queue.length)) {
    const { url, depth: currentDepth } = queue.shift();
    if ( ( currentDepth > maxDepth) || visited.has(url)) continue;

    visited.add(url);

    console.log(
      chalk.blue(`📬 Crawling: ${chalk.underline(url)} | Depth: ${currentDepth}`)
    );

    try {
      const { extracted, links } = await visitPage(url, page);
      crawlResults.set(url, JSON.stringify(extracted));

      // Limit links and track depth
      const limitedLinks = links.slice(0, base);
      for (const link in limitedLinks) {
        if (!visited.has(link)) {
          queue.push({ url: limitedLinks[link], depth: currentDepth + 1 });
        }
      }

    } catch (error) {
      console.error(
        chalk.red(`❌ Error visiting ${chalk.underline(url)}: ${error.message}`)
      );
    }
  }
  console.log(chalk.magenta.bold("\n🎉 Crawl Completed!"));
  console.log(chalk.gray(`📄 Total Pages Crawled: ${visited.size}`));
  browser.close();

  return JSON.stringify(crawlResults, replacer)
};