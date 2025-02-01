import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const CrawlSufficientSchema = z.object({
  isSufficient: z.boolean(),
});

export type CrawlSufficient = z.infer<typeof CrawlSufficientSchema>;

export const CrawlSufficientResponseParser =
  StructuredOutputParser.fromZodSchema(CrawlSufficientSchema);
