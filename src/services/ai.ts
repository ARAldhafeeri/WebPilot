// src/services/ai.service.ts
import { Page } from "playwright";
import { Task } from "../schemas/task";
import { ActionStep } from "../schemas/action";
import { WebPilotModel } from "../types/models";
import { IWebPilotClient } from "../types/config";
import { Links, Visited, IAiService } from "../types/ai"; // Adjust import path

export class AIService implements IAiService {
  // Explicit interface implementation
  private model: WebPilotModel;

  constructor(protected webPilotClient: IWebPilotClient) {
    this.model = webPilotClient.getModel();
  }

  async generateActions(
    content: string,
    objective: string
  ): Promise<ActionStep[]> {
    // TODO: Implement AI-driven action generation logic
    // Example: Use model to analyze content/objective and return actionable steps
    return [];
  }

  async isContentRelevant(
    content: string,
    task: Task // Changed parameter to match interface
  ): Promise<boolean> {
    // TODO: Implement AI-powered relevance check using task.objective
    // Example: Use model to check if content matches task objectives
    return false;
  }

  async processContent(content: string, page: Page): Promise<void> {
    // TODO: Implement content processing logic
    // Example: Extract structured data from content using AI model
  }

  async prioritizeLinks(links: Links, task: Task): Promise<Links> {
    // TODO: Implement AI-powered link prioritization
    // Example: Rank links based on relevance to task objectives
    return links;
  }

  async hasSufficientData(task: Task): Promise<Boolean> {
    // TODO: Implement AI-driven data sufficiency check
    // Example: Analyze collected data against task requirements
    return false;
  }
}
