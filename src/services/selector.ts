import { Page } from "playwright";

export const INTERACTABLE_ELEMENTS = [
  "a[href]",
  "button",
  'input:not([type="hidden"])',
  "select",
  "textarea",
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[contenteditable="true"]',
];

class Selector {
  async getInteractableElements(page: Page) {
    const locator = page.locator(INTERACTABLE_ELEMENTS.join(","));
    const elementLocators = await locator.all();
    const elementDescriptions = [];

    for (const elementLocator of elementLocators) {
      let selector = null;
      let text = null;
      let tagName = null;
      let canPush = false;
      try {
        selector = await this.getSelector(elementLocator);
        text = await elementLocator.evaluate((el) =>
          (el.textContent || el.getAttribute("aria-label") || "").trim()
        );
        tagName = await elementLocator.evaluate((el) =>
          el.tagName.toLowerCase()
        );
        canPush = true;
      } catch {
        canPush = false;
      }
      if (canPush) {
        elementDescriptions.push({ selector, text, tagName });
      }
    }

    return elementDescriptions;
  }

  async getSelector(elementLocator: any) {
    return elementLocator.evaluate((element: HTMLElement) => {
      const escape = (str: string) => CSS.escape(str);

      function getChildSelector(el: HTMLElement, parent: HTMLElement) {
        const tag = el.tagName.toLowerCase();
        const index =
          Array.from(parent.children)
            .filter((child) => child.tagName === el.tagName)
            .indexOf(el) + 1;

        if (el.className) {
          const classes = el.className.split(/\s+/).filter((c) => c.length);
          return `${tag}.${escape(classes[0])}`;
        }

        return index > 1 ? `${tag}:nth-child(${index})` : tag;
      }

      function getFallbackSelector(el: any) {
        const path = [];
        let current = el;

        while (
          current &&
          current.nodeType === Node.ELEMENT_NODE &&
          path.length < 3
        ) {
          let selector = current.tagName.toLowerCase();
          if (current.className) {
            const classes = current.className
              .split(/\s+/)
              .filter((c: string) => c.length);
            if (classes.length) selector += `.${escape(classes[0])}`;
          }
          path.unshift(selector);
          current = current.parentElement;
        }
        return path.join(" > ");
      }

      if (element.id) return `#${escape(element.id)}`;

      if (element.className) {
        const classes = element.className.split(/\s+/).filter((c) => c.length);
        for (const cls of classes) {
          const selector = `${element.tagName.toLowerCase()}.${escape(cls)}`;
          if (document.querySelectorAll(selector).length === 1) return selector;
        }
      }

      const name = element.getAttribute("name");
      if (name) {
        const selector = `${element.tagName.toLowerCase()}[name="${escape(
          name
        )}"]`;
        if (document.querySelectorAll(selector).length === 1) return selector;
      }

      const parentWithId: HTMLElement = element.closest(
        "[id]"
      ) as unknown as HTMLElement;
      if (parentWithId) {
        const childSelector = getChildSelector(element, parentWithId);
        return `#${escape(parentWithId.id)} ${childSelector}`;
      }

      const tagSelector = element.tagName.toLowerCase();
      if (document.querySelectorAll(tagSelector).length === 1)
        return tagSelector;

      return getFallbackSelector(element);
    });
  }
}

export default Selector;
