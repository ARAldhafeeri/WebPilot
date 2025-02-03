import { INTERACTABLE_ELEMENTS } from "../config/selector";
import { ISelector } from "../types/selector";
import { Page } from "playwright";

class Selector implements ISelector {
  async getInteractableElements(page: Page) {
    const elements = await page.evaluate(() =>
      document.querySelectorAll(
        [
          "a[href]",
          "button",
          'input:not([type="hidden"])',
          "select",
          "textarea",
          '[tabindex]:not([tabindex="-1"])',
          '[role="button"]',
          '[role="link"]',
          '[contenteditable="true"]',
        ].join(",")
      )
    );

    const interactableElements = Array.from(elements);

    // Generate element descriptions
    const elementDescriptions = interactableElements.map(async (element) => {
      return {
        selector: await this.getSelector(element, page),
        text: this.getElementText(element),
        tagName: element.tagName.toLowerCase(),
      };
    });
    return Promise.all(elementDescriptions);
  }

  getElementText(element: Element) {
    return (
      element.textContent || element.getAttribute("aria-label")?.trim() || ""
    );
  }

  async getSelector(element: Element, page: Page) {
    // Helper function to escape CSS identifiers
    const escape = (str: string) => CSS.escape(str);

    // Quick return for elements with ID (with escaping)
    if (element.id) return `#${escape(element.id)}`;

    // Try to find a unique class combination (with escaping)
    if (element.className) {
      const classes = element.className.split(/\s+/).filter((c) => c.length);
      for (const cls of classes) {
        const escapedClass = escape(cls);
        const selector = `${element.tagName.toLowerCase()}.${escapedClass}`;
        if (await this.isUnique(selector, page)) return selector;
      }
    }

    // Check for name attribute (with escaping)
    const name = element.getAttribute("name");
    if (name) {
      const selector = `${element.tagName.toLowerCase()}[name="${escape(
        name
      )}"]`;
      if (await this.isUnique(selector, page)) return selector;
    }

    // Look for parent container with ID (with escaping)
    const parentWithId = element.closest("[id]");
    if (parentWithId) {
      const childSelector = this.getChildSelector(element, parentWithId);
      const selector = `#${escape(parentWithId.id)} ${childSelector}`;
      if (await this.isUnique(selector, page)) return selector;
    }

    // Check for unique tag name
    const tagSelector = element.tagName.toLowerCase();
    if (await this.isUnique(tagSelector, page)) return tagSelector;

    // Fallback to simplified hierarchy
    return this.getFallbackSelector(element);
  }

  getChildSelector(element: Element, parent: Element): string {
    const tag = element.tagName.toLowerCase();
    const index =
      Array.from(parent.children)
        .filter((child) => child.tagName === element.tagName)
        .indexOf(element) + 1;

    if (element.className) {
      const classes = element.className.split(/\s+/).filter((c) => c.length);
      return `${tag}.${CSS.escape(classes[0])}`;
    }

    return index > 1 ? `${tag}:nth-child(${index})` : tag;
  }

  getFallbackSelector(element: Element): string {
    const path = [];
    let current: Element | null = element;

    while (
      current &&
      current.nodeType === Node.ELEMENT_NODE &&
      path.length < 3
    ) {
      let selector = current.tagName.toLowerCase();

      if (current.className) {
        const classes = current.className.split(/\s+/).filter((c) => c.length);
        if (classes.length) selector += `.${CSS.escape(classes[0])}`;
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(" > ");
  }

  async isUnique(selector: any, page: Page) {
    return page.evaluate(
      () => document.querySelectorAll(selector).length === 1
    );
  }
}

export default Selector;
