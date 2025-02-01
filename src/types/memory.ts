import { Task } from "../schemas/task";

export type Link = { url: string; depth: number };
export type LinksQueue = Array<Link>;

export interface IMemory {
  pushToLinksQueue(payload: Link): void;
  popFromLinksQueue(): Link | undefined;
  lengthOfLinksQueue(): number;
  isLinkHasBeenVisited(link: string): boolean;
  addUrlToVisted(url: string): void;
  getTaskContext(): Task | null;
}
