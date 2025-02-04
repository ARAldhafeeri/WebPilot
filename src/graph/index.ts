import crawlWorkflow from "./graphs/crawler";
import researchWorkflow from "./graphs/researcher";

export const graph = {
  research: researchWorkflow.compile(),
  crawl: crawlWorkflow.compile(),
  // browse: browseWorkflow.compile(),
};
