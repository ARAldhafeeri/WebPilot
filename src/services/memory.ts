import { Task } from "../schemas/task";
import { IMemory, Link, LinksQueue } from "../types/memory";
import { Visited } from "../types/ai";

export class Memory implements IMemory {
  private visited: Visited = new Set();
  private linksQueue: LinksQueue = [];
  private currentTask: Task | null = null;

  pushToLinksQueue(payload: Link): void {
    this.linksQueue.push(payload);
  }

  popFromLinksQueue(): Link | undefined {
    return this.linksQueue.shift();
  }

  lengthOfLinksQueue(): number {
    return this.linksQueue.length;
  }

  addUrlToVisted(url: string): void {
    this.visited.add(url);
  }

  isLinkHasBeenVisited(link: string): boolean {
    return this.visited.has(link);
  }

  getTaskContext(): Task | null {
    return this.currentTask;
  }
}
