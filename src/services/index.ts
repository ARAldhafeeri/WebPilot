import webPilotClient from "../config";
import { AIService } from "./ai";
import { Crawler } from "./crawler";
import Executor from "./executor";
import Navigator from "./navigator";

export const aiService = new AIService(webPilotClient);
export const executorService = new Executor();
export const navigatorService = new Navigator(aiService, executorService);
export const crawlerService = new Crawler(aiService, 5, navigatorService);
