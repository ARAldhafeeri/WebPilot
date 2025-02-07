import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
export type WebPilotModel = ChatOpenAI | ChatOllama;
