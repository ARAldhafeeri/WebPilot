import { IMemory, Link, LinksQueue } from "../types/memory";
import { Visited } from "../types/ai";

export class Memory implements IMemory {
  private visited: Visited = new Set();
  private linksQueue: LinksQueue = [];
  private taskContext: Map<string, string> = new Map();

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

  getVisted(): Set<string> {
    return this.visited;
  }

  isLinkHasBeenVisited(link: string): boolean {
    return this.visited.has(link);
  }

  getTaskContext(): string {
    return JSON.stringify(
      this.taskContext,
      (key, value) => `URL : ${key} - Context ${value}`
    );
  }

  addTaskContext(url: string, text: string): void {
    this.taskContext.set(url, text);
  }

  getUrlContext(url: string): string {
    return this.taskContext.get(url) || "";
  }

  purge(): void {
    // release resources
    this.taskContext.clear();
    this.linksQueue = [];
    this.visited.clear();
  }
}
