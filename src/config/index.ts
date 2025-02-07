import { ChatOpenAI } from "@langchain/openai";

// import { ChatDeepSeek } from "@langchain/deepseek";

import { API_KEY, MODEL_SLUG, PROVIDER_BASE_URL } from "../getEnv";

const model = new ChatOpenAI({
  configuration: {
    baseURL: PROVIDER_BASE_URL,
  },
  apiKey: API_KEY,
  model: MODEL_SLUG,
  temperature: 0.8,
  frequencyPenalty: 0.2,
  presencePenalty: 0.3,
  topP: 0.9,
});

export const llm = model;
