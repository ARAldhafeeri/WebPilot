import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import {
  BrowserTask,
  CrawlTask,
  HighLevelTask,
  ResearchTask,
  SearchResults,
  Task,
} from "../schemas/task";
import { CrawlSufficient } from "../schemas/crawl";
import { Link } from "../types/memory";
import { APP_MODES } from "../config/modes";

// This defines the object that is passed between each node
export const AppState = Annotation.Root({
  mode: Annotation<string>({
    reducer: (prev, next) => next ?? prev ?? APP_MODES.research,
    default: () => APP_MODES.research,
  }),
  messages: Annotation<BaseMessage[]>({
    reducer: (prev, next) => prev.concat(next),
  }),
  sender: Annotation<string>({
    reducer: (prev, next) => next ?? prev ?? "user",
    default: () => "user",
  }),
  crawlTaskDescription: Annotation<CrawlTask>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({ depth: 0, base: 1, urls: [], description: "" }),
  }),
  researchTask: Annotation<ResearchTask>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({ topic: "", keyFindings: [], references: [] }),
  }),
  browserTasks: Annotation<BrowserTask>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({ objective: "", steps: [] }),
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
  crawlData: Annotation<CrawlSufficient>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({
      pages: new Map(),
    }),
  }),
  searchResults: Annotation<SearchResults>({
    reducer: (prev, next) => ({
      results: [...prev.results, ...next.results],
    }),
    default: () => ({ results: [] }),
  }),
});
