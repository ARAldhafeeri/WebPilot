import { MessageContentComplex } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatOpenAI } from "@langchain/openai";

export type WebPilotModel = ChatOpenAI | ChatDeepSeek | null;
