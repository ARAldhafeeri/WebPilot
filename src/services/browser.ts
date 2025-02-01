// src/services/browser.service.ts
import { chromium, Browser, Page } from "playwright";

export class BrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {}

  async execute() {
    try {
      await this.initializeBrowser();
    } finally {
      await this.cleanup();
    }
  }

  private async initializeBrowser(): Promise<void> {
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
  }

  private async cleanup(): Promise<void> {
    await this.page?.close();
    await this.browser?.close();
  }
}
