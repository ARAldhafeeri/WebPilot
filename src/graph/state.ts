import { BaseMessage } from "@langchain/core/messages";
import { Annotation } from "@langchain/langgraph";
import { ResearchTask, SearchResults, Task } from "../schemas/task";
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
  researchTask: Annotation<ResearchTask>({
    reducer: (prev, next) => next ?? prev ?? null,
    default: () => ({ topic: "", keyFindings: [], references: [] }),
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
  searchResults: Annotation<SearchResults>({
    reducer: (prev, next) => ({
      results: [...prev.results, ...next.results],
    }),
    default: () => ({ results: [] }),
  }),
});
