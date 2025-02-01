import { Page } from "playwright";

export interface SelectorEntry {
  selector: string;
  text: string;
  tagName: string;
}

export type InteractableSelectors = string[];

export interface ISelector {
  getInteractableElements(page: Page): Promise<SelectorEntry[]>;
  getElementText(element: Element): string;
  getSelector(element: Element, page: Page): Promise<string>;
  getChildSelector(element: Element, parent: Element): string;
  getFallbackSelector(element: Element): string;
  isUnique(selector: any, page: Page): Promise<boolean>;
}
