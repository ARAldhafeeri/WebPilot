import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const CrawlSufficientSchema = z.object({
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
