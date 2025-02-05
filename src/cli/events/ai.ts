import webPilotEventEmitter, { EVENT_NAMES } from "../events";
import { console_out } from "../helpers";

webPilotEventEmitter.on(EVENT_NAMES.ai_researcher_question, function (data) {
  // handle ai message
  console_out(data);
});

webPilotEventEmitter.on(EVENT_NAMES.user_answer_ai_question, function (data) {
  // handle ai message
  console_out(data);
});
