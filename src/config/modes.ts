import { InMemoryStore } from "@langchain/langgraph";

export const APP_MODES = {
  crawl: "crawl",
  research: "research",
  browse: "browse",
};

const store = new InMemoryStore();

export const MODE_CONTEXT = "mode";

export const setModeFromMemoryStore = async (mode: string) => {
  await store.put([MODE_CONTEXT], "mode", { name: mode });
};

export const getModeFromMemoryStore = async () => {
  return await store.get([MODE_CONTEXT], "mode");
};
