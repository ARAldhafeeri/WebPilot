import { openBrowser } from "../functions/browser";
import { AppState } from "../graph/state";
import { tool } from "@langchain/core/tools";

export const executorTool = tool(
  async (state: typeof AppState.State) => {
    // open browser go to root page, to execute steps
    const page = await openBrowser();

    for (const step of state.currentTask.steps) {
      const retry = { maxAttempts: 3, delay: 1000 };
      let attempt = 0;

      while (attempt < retry.maxAttempts) {
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
              break;
            case "hover":
              await page.hover(step.selector as string);
              break;
            case "scroll":
              await page.mouse.wheel(0, 1000);
              break;
          }
          break;
        } catch (error) {
          if (++attempt >= retry.maxAttempts) throw error;
          await page.waitForTimeout(retry.delay);
        }
      }
    }
  },
  {
    name: "browser_executor",
    description: "execute browser tasks",
  }
);
