import { WebPilotModel } from "./models";

export type ApiKey = string | null;

export interface IWebPilotClient {
  setApiKey(key: ApiKey): void;
  setType(type: string): void;
  setModelSlug(modelSlug: string): void;
  setModel(model: WebPilotModel): void;
  getModel(): WebPilotModel;
}
