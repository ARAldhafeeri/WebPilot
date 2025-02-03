// src/services/browser.service.ts
import { chromium, Browser, Page } from "playwright";

export class BrowserService {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {}

  async initializeBrowser(): Promise<Page> {
    this.browser = await chromium.launch({ headless: false });
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    return this.page;
  }

  async cleanup(): Promise<void> {
    // close browser
    await this.page?.close();
    await this.browser?.close();
  }
}
