import { browserService } from "../services";

export async function openBrowser() {
  const page = browserService.initializeBrowser();
  return page;
}

export async function closeBrowser() {
  browserService.cleanup();
}
