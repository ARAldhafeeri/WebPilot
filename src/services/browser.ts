// src/services/browser.service.ts
import { chromium, Browser, Page } from "playwright";
import { Task } from "../schemas/task";
import { ActionStep } from "../schemas/action";

export class BrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async execute(task: Task): Promise<string> {
    try {
      await this.initializeBrowser();
      return await this.executeSteps(task.steps);
    } finally {
      await this.cleanup();
    }
  }

  private async initializeBrowser(): Promise<void> {
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  private async executeSteps(steps: ActionStep[]): Promise<string> {
    if (!this.page) throw new Error("Browser not initialized");

    for (const [index, step] of steps.entries()) {
      await this.executeStep(step, index + 1);
    }

    return this.page.content();
  }

  private async executeStep(
    step: ActionStep,
    stepNumber: number
  ): Promise<void> {
    try {
      await this.page?.waitForSelector(step.waitForSelector, {
        timeout: step.maxWaitTime,
      });

      switch (step.action) {
        case "navigate":
          await this.page?.goto(step.url!);
          break;
        case "click":
          await this.page?.click(step.selector!);
          break;
        case "fill":
          await this.page?.fill(step.selector!, step.text!);
          break;
        case "hover":
          await this.page?.hover(step.selector!);
          break;
        case "scroll":
          await this.page?.evaluate(() => window.scrollBy(0, 100));
          break;
      }

      await this.page?.waitForTimeout(1000); // Natural delay
    } catch (error) {
      await this.handleStepError(error, step, stepNumber);
    }
  }

  private async handleStepError(
    error: unknown,
    step: ActionStep,
    stepNumber: number
  ): Promise<void> {
    // Implement retry logic and error reporting
  }

  private async cleanup(): Promise<void> {
    await this.page?.close();
    await this.browser?.close();
  }
}
