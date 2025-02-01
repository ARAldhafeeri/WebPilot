import { Task, TaskSchema } from "../schemas/task";
import { BrowserService } from "../services/browser";
import { AIService } from "../services/ai";

export class AIOrchestrator {
  constructor(
    private browserService: BrowserService,
    private aiService: AIService
  ) {}

  async executeTask(userInput: string): Promise<Task> {
    try {
      // Validate input structure
      const task = await this.validateInput(userInput);

      // Enhance task with AI analysis
      const enhancedTask = await this.aiService.enhanceTask(task);

      // Execute browser actions
      const result = await this.browserService.execute(enhancedTask);

      // Generate final response
      return this.aiService.generateCompletion(result);
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  private async validateInput(input: string): Promise<Task> {
    return TaskSchema.parseAsync(JSON.parse(input));
  }

  private async handleError(error: unknown): Promise<void> {
    // Implement error handling strategy
  }
}
