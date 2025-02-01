import { ActionStep } from "../schemas/action";
import { Page } from "playwright";

export interface IExecutor {
  executeActionSteps(steps: ActionStep[], page: Page): Promise<void>;
}
