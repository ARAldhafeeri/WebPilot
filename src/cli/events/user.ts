import webPilotEventEmitter, { EVENT_NAMES } from "../events";
import {
  console_out,
  isCrawlThread,
  isResearchThread,
  onBrwoseChat,
  onCrawlChat,
  onResearchChat,
} from "../helpers";

webPilotEventEmitter.on(EVENT_NAMES.user_prompt, function async(data) {
  if (isCrawlThread(state.title)) {
    await onCrawlChat(input);
  } else if (isResearchThread(state.title)) {
    await onResearchChat(input);
  } else {
    await onBrwoseChat(input);
  }
});
