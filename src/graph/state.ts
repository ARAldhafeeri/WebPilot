import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { HighLevelTask, SearchResults, Task } from "../schemas/task";
import { CrawlSufficient } from "../schemas/crawl";
import { Link } from "../types/memory";

// This defines the object that is passed between each node
export const AppState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (prev, next) => prev.concat(next),
  }),
  sender: Annotation<string>({
    reducer: (prev, next) => next ?? prev ?? "user",
    default: () => "user",
  }),
  highLevelTask: Annotation<HighLevelTask>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({ description: "", urls: [], searchTasks: [] }),
  }),
  currentTask: Annotation<Task>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({
      id: "",
      name: "",
      steps: [],
      status: "pending",
    }),
  }),
  crawlData: Annotation<CrawlSufficient | null>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => null,
  }),
  searchResults: Annotation<SearchResults>({
    reducer: (prev, next) => ({
      results: [...prev.results, ...next.results],
    }),
    default: () => ({ results: [] }),
  }),
  taskContext: Annotation<Map<string, string>>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => new Map(),
  }),
  linksQueue: Annotation<Array<Link>>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => [],
  }),
  visited: Annotation<Set<string>>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => new Set(),
  }),
  crawledFirstUrl: Annotation<Boolean>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => false,
  }),
});
