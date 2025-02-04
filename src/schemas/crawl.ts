import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const CrawlSufficientSchema = z.object({
  pages: z.map(z.string(), z.string()),
});

export type CrawlSufficient = z.infer<typeof CrawlSufficientSchema>;

export const CrawlSufficientResponseParser =
  StructuredOutputParser.fromZodSchema(CrawlSufficientSchema);
