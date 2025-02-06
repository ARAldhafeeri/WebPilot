import { browserService } from "../services";

export async function openBrowser() {
  const page = await browserService.initializeBrowser();
  await page.waitForLoadState();
  return page;
}

export async function closeBrowser() {
  browserService.cleanup();
}
