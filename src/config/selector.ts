import { InteractableSelectors } from "../types/selector";

export const INTERACTABLE_ELEMENTS: InteractableSelectors = [
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
