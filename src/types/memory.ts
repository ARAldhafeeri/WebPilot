import { ActionStep } from "../schemas/action";
import { Task } from "../schemas/task";

export interface IMemory {
  addLinks(links: string[], task: Task, depth: number): void;
  getNextActionStep(): ActionStep | null;
  recordActionResult(step: ActionStep, success: boolean): void;
  getTaskContext(): Task | null;
}
