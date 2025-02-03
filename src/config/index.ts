import { ApiKey, IWebPilotClient } from "../types/config";
import { WebPilotModel } from "../types/models";
import { SUPPORTED_MODEL_TYPES } from "./modelTypes";
import { ChatOpenAI } from "@langchain/openai";
// import { Ollama } from "@langchain/ollama";
// import { ChatDeepSeek } from "@langchain/deepseek";

import { API_KEY, MODEL_PROVIDER, MODEL_SLUG, OLLAMA_URL } from "../getEnv";
class WebPilotClient implements IWebPilotClient {
  private apiKey: ApiKey;
  private type: string;
  private modelSlug: string;
  private model: WebPilotModel;
  private baseUrl: string;

  constructor() {
    this.apiKey = null;
    this.type = "";
    this.modelSlug = "";
    this.model = null;
    this.baseUrl = "";
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

  setBaseURL(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getModel(): WebPilotModel {
    // set model once and return it in future calls.
    if (this.model !== null) {
      return this.model;
    }
    if (!this.apiKey) {
      throw new Error("API key is not set.");
    }
    let model: WebPilotModel | null;
    switch (this.type) {
      case SUPPORTED_MODEL_TYPES.openai:
        model = new ChatOpenAI({
          apiKey: this.apiKey as string,
          model: this.modelSlug,
          temperature: 0,
        });
        break;
      // case SUPPORTED_MODEL_TYPES.deepseek:
      //   model = new ChatDeepSeek({
      //     openAIApiKey: this.apiKey as string,
      //     model: this.modelSlug,
      //     temperature: 0,
      //   });
      //   break;
      // case SUPPORTED_MODEL_TYPES.llama:
      //   model = new Ollama({
      //     baseUrl: this.baseUrl,
      //     model: this.modelSlug,
      //   });
      //   break;
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
// if (MODEL_PROVIDER === SUPPORTED_MODEL_TYPES.llama) {
//   webPilotClient.setBaseURL(OLLAMA_URL);
// }

export const llm = webPilotClient.getModel();

export default webPilotClient;
