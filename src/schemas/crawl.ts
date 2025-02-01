import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const CrawlSufficientSchema = z.object({
  isSufficient: z.boolean(),
  isRelevant: z.boolean(),
  selectors: z.array(
    z.object({
      selector: z.string(),
      text: z.string(),
      tagName: z.string(),
    })
  ),
});

export type CrawlSufficient = z.infer<typeof CrawlSufficientSchema>;

export const CrawlSufficientResponseParser =
  StructuredOutputParser.fromZodSchema(CrawlSufficientSchema);
