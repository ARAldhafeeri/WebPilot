import webPilotClient from "../config";
import { AIService } from "./ai";
import { Crawler } from "./crawler";
import Executor from "./executor";
import { Memory } from "./memory";
import Navigator from "./navigator";

export const memoryService = new Memory();
export const aiService = new AIService(webPilotClient);
export const executorService = new Executor();
export const navigatorService = new Navigator(
  aiService,
  executorService,
  memoryService
);
export const crawlerService = new Crawler(
  aiService,
  5,
  navigatorService,
  memoryService
);
