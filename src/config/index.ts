import { ChatOpenAI } from "@langchain/openai";
// import { Ollama } from "@langchain/ollama";
// import { ChatDeepSeek } from "@langchain/deepseek";

import { API_KEY, MODEL_SLUG, PROVIDER_BASE_URL } from "../getEnv";

const model = new ChatOpenAI({
  configuration: {
    baseURL: PROVIDER_BASE_URL,
  },
  apiKey: API_KEY,
  model: MODEL_SLUG,
});

export const llm = model;
