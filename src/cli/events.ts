import { console_out, setCliPrompt } from "./helpers";
import { EventEmitter } from "stream";

const webPilotEventEmitter = new EventEmitter();

export function WebPilotAIMessage(message: string) {
  webPilotEventEmitter.emit("ai", message);
}

export const EVENT_NAMES = {
  user_prompt: "user_prompt",
  ai_researcher_question: "ai_researcher_question",
  user_answer_ai_question: "user_answer_ai_question",
};

export default webPilotEventEmitter;
