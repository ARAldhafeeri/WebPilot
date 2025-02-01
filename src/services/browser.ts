// src/services/browser.service.ts
import { chromium, Browser, Page } from "playwright";
import { webPilotInfo } from "../config/communicator";
import { IMemory } from "../types/memory";

export class BrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(private memory: IMemory) {}

  private async initializeBrowser(): Promise<void> {
    webPilotInfo(" I am intializing browser for the task.");
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  private async cleanup(): Promise<void> {
    webPilotInfo(
      " I am closing the browser also cleaning up resources in memory."
    );

    // cleanup memory:
    this.memory.purge();
    // close browser
    await this.page?.close();
    await this.browser?.close();
  }
}
