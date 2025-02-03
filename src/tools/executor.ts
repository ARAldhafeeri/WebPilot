import { openBrowser } from "../functions/browser";
import { AppState } from "../graph/state";
import { tool } from "@langchain/core/tools";

export const executorTool = tool(
  async (state: typeof AppState.State) => {
    // open browser go to root page, to execute steps
    const page = await openBrowser();
    await page.goto(state.highLevelTask.urls[0]);
    for (const step of state.currentTask.steps) {
      const retry = { maxAttempts: 3, delay: 1000 };
      let attempt = 0;

      while (attempt < retry.maxAttempts) {
        try {
          switch (step.action) {
            case "click":
              await page.click(step.selector!);
              break;
            case "fill":
              await page.fill(step.selector!, step.text!);
              break;
            case "navigate":
              await page.goto(step.url!);
              break;
            case "hover":
              await page.hover(step.selector!);
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
