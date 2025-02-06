import { NODE_NAMES } from "../config/names";
import { AppState } from "../graph/state";
import { tool } from "@langchain/core/tools";
import { chromium, Browser, Page } from "playwright";
import { parentPort } from "worker_threads";
import { Task } from "../schemas/task";

export const executorTool = tool(
  async (State: typeof AppState.State) => {
    // open browser go to root page, to execute steps
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.waitForLoadState();
    const checkBrowserClosed = setInterval(async () => {
      try {
        await page.title();
      } catch (error) {
        clearInterval(checkBrowserClosed);
        await browser.close();
        console.log("Browser closed by user.");
      }
    }, 2000);
    for (const step of State.currentTask.steps) {
      try {
        switch (step.action) {
          case "click":
            await page.click(step.selector as string);
            break;
          case "fill":
            await page.fill(step.selector as string, step.text as string);
            break;
          case "navigate":
            await page.goto(step.url);
            await page.waitForLoadState();
            break;
          case "hover":
            await page.hover(step.selector as string);
            break;
          case "scroll":
            await page.mouse.wheel(0, 1000);
            break;
        }
        break;
      } catch (error: any) {
        console.log("error", error.message);
      }
    }
  },
  {
    name: NODE_NAMES.executorTool,
    description: "execute browser tasks",
  }
);

// Helper function to wait for a random delay (in milliseconds)
function randomDelay(min: number = 500, max: number = 1500): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
let browserInstance: Browser | null = null;
let pageInstance: Page | null = null;

export async function getOrInitBrowserPage(): Promise<Page> {
  // If a page already exists and is not closed, return it.
  if (pageInstance && !pageInstance.isClosed()) {
    return pageInstance;
  }

  // Otherwise, initialize a new browser and page.
  if (!browserInstance) {
    // Launch the browser with options (e.g., headless: false for visual debugging).
    browserInstance = await chromium.launch({ headless: false, slowMo: 50 });
    const page = await browserInstance.newPage();
    return page;
  }

  return pageInstance as unknown as Page;
}

export async function runExecutorTask(task: Task) {
  // Launch browser with slowMo to further simulate human-like delays.
  const page = await getOrInitBrowserPage();
  await page.waitForLoadState();
  console.log("AppState.State", task);

  // Check if the browser was closed by the user.
  const checkBrowserClosed = setInterval(async () => {
    try {
      await page.title();
    } catch (error) {
      clearInterval(checkBrowserClosed);
      await browserInstance?.close();
      browserInstance = null;
      console.log("Browser closed by user.");
    }
  }, 2000);

  for (const step of task.steps) {
    try {
      // Add a random delay before each step to simulate human pause.
      await randomDelay();

      switch (step.action) {
        case "click":
          await page.click(step.selector as string);
          break;

        case "fill":
          // Instead of filling the input instantly, type it out slowly.
          if (typeof step.text === "string") {
            // Clear the field first if needed
            await page.click(step.selector as string, { clickCount: 3 });
            await page.keyboard.press("Backspace");
            await page.type(step.selector as string, step.text, { delay: 100 });
          }
          break;

        case "navigate":
          await page.goto(step.url);
          await page.waitForLoadState();
          break;

        case "hover":
          await page.hover(step.selector as string);
          break;

        case "scroll":
          // Scroll in increments to simulate natural scrolling.
          for (let i = 0; i < 10; i++) {
            await page.mouse.wheel(0, 100);
            await randomDelay(100, 300);
          }
          break;

        default:
          console.log("Unknown action:", step.action);
      }

      // Optionally add a delay after each step as well.
      await randomDelay();
    } catch (error: any) {
      console.log("error", error.message);
    }
  }

  parentPort && parentPort.postMessage({ status: "done" });
}

parentPort &&
  parentPort.on("message", (msg) => {
    if (msg && msg.state) {
      runExecutorTask(msg.state);
    } else {
      console.error("No state provided to worker.");
    }
  });
