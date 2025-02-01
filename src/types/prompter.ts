import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export interface IPrompter {
  prompt(
    userInput: string,
    systemInput: string
  ): Array<SystemMessage | HumanMessage>;
}
