// src/types/memory.ts
import { z } from "zod";
import { Task } from "../schemas/task";
import { ActionStepSchema } from "../schemas/action";
import { IMemory } from "../types/memory";
import { Queue, Visited } from "../types/ai";

type ActionStep = z.infer<typeof ActionStepSchema>;

export class Memory implements IMemory {
  private visited: Visited = new Set();
  private queue: Queue = [];
  private currentTask: Task | null = null;
  private actionHistory: ActionStep[] = [];

  addLinks(links: string[], task: Task, depth: number = 0): void {
    const baseDomain = new URL(task.currentUrl).hostname;

    const filtered = links.filter((link) => {
      try {
        const url = new URL(link);
        return url.hostname.includes(baseDomain) && !this.visited.has(link);
      } catch {
        return false;
      }
    });

    this.queue.push(
      ...filtered
        .map((url) => ({ url, depth }))
        .sort((a, b) => a.depth - b.depth)
    );
  }

  getNextActionStep(): ActionStep | null {
    return (
      this.currentTask?.steps.find(
        (step) =>
          !this.actionHistory.some((h) => h.description === step.description)
      ) || null
    );
  }

  recordActionResult(step: ActionStep, success: boolean): void {
    if (success) {
      this.actionHistory.push(ActionStepSchema.parse(step));
    } else {
      this.queue.unshift({
        url: step.url || this.currentTask?.currentUrl || "",
        depth: 0,
      });
    }
  }

  getTaskContext(): Task | null {
    return this.currentTask;
  }
}
