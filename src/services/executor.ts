import { ActionStep } from "../schemas/action";
import { Page } from "playwright";
import { IExecutor } from "../types/executor";
import { webPilotInfo } from "../config/communicator";

class Executor implements IExecutor {
  async executeActionSteps(steps: ActionStep[], page: Page) {
    for (const step of steps) {
      const retry = step.retryPolicy || { maxAttempts: 3, delay: 1000 };
      let attempt = 0;

      while (attempt < retry.maxAttempts) {
        try {
          await page.waitForSelector(step.waitForSelector, {
            timeout: step.maxWaitTime,
          });

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

    webPilotInfo(
      `I am done executing steps inside the browser for the following page : ${page.url}`
    );
  }
}

export default Executor;
