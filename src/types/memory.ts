import { Task } from "../schemas/task";

export type Link = { url: string; depth: number };
export type LinksQueue = Array<Link>;

export interface IMemory {
  pushToLinksQueue(payload: Link): void;
  popFromLinksQueue(): Link | undefined;
  lengthOfLinksQueue(): number;
  isLinkHasBeenVisited(link: string): boolean;
  addUrlToVisted(url: string): void;
  getTaskContext(): string;
  getVisted(): Set<string>;
  getUrlContext(url: string): string;
  addTaskContext(url: string, text: string): void;
  purge(): void;
}
