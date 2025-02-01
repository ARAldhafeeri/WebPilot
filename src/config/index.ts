import { ApiKey, IWebPilotClient } from "../types/config";
import { WebPilotModel } from "../types/models";
import { SUPPORTED_MODEL_TYPES } from "./modelTypes";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatOpenAI } from "@langchain/openai";
import { API_KEY, MODEL_PROVIDER, MODEL_SLUG } from "../getEnv";
class WebPilotClient implements IWebPilotClient {
  private apiKey: ApiKey;
  private type: string;
  private modelSlug: string;
  private model: WebPilotModel;

  constructor() {
    this.apiKey = null;
    this.type = "";
    this.modelSlug = "";
    this.model = null;
  }

  setApiKey(key: ApiKey): void {
    if (!key) {
      throw new Error("API key cannot be null or undefined.");
    }
    this.apiKey = key;
  }

  setType(type: string): void {
    this.type = type;
  }

  setModelSlug(modelSlug: string): void {
    if (!modelSlug) {
      throw new Error("Model slug cannot be empty.");
    }
    this.modelSlug = modelSlug;
  }

  setModel(model: WebPilotModel) {
    this.model = model;
  }

  getModel() {
    // set model once and return it in future calls.
    if (this.model !== null) {
      return this.model;
    }
    if (!this.apiKey) {
      throw new Error("API key is not set.");
    }
    let model;
    switch (this.type) {
      case SUPPORTED_MODEL_TYPES.openai:
        model = new ChatOpenAI({
          apiKey: this.apiKey as string,
          model: this.modelSlug,
          temperature: 0,
        });
        break;
      case SUPPORTED_MODEL_TYPES.deepseek:
        model = new ChatDeepSeek({
          openAIApiKey: this.apiKey as string,
          model: this.modelSlug,
          temperature: 0,
        });
        break;
      default:
        model = new ChatOpenAI({
          apiKey: this.apiKey as string,
          model: this.modelSlug,
        });
    }
    this.setModel(model);
    return model;
  }
}

const webPilotClient = new WebPilotClient();

webPilotClient.setApiKey(API_KEY);
webPilotClient.setModelSlug(MODEL_SLUG);
webPilotClient.setType(MODEL_PROVIDER);

export default webPilotClient;
