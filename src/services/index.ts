import webPilotClient from "../config";
import { AIService } from "./ai";
import { Crawler } from "./crawler";
import Executor from "./executor";
import { Memory } from "./memory";
import Selector from "./selector";

export const memoryService = new Memory();
export const aiService = new AIService(webPilotClient);
export const executorService = new Executor();
export const selectorService = new Selector();
export const crawlerService = new Crawler(
  aiService,
  5,
  memoryService,
  selectorService
);
