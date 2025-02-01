import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { IPrompter } from "../types/prompter";

class Prompter implements IPrompter {
  prompt(userInput: string, systemInput: string) {
    return [new SystemMessage(systemInput), new HumanMessage(userInput)];
  }
}

const prompter = new Prompter();
