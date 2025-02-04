import { z } from "zod";
import { ActionStepSchema } from "./action";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const TaskSchema = z.object({
  steps: z.array(ActionStepSchema).min(1),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskSchemaResponseParser =
  StructuredOutputParser.fromZodSchema(TaskSchema);

// high level task

export const HighLevelTaskSchema = z.object({
  description: z.string().min(10).max(500),
  urls: z.array(z.string().url()),
  searchTasks: z.array(z.string()),
});

export type HighLevelTask = z.infer<typeof HighLevelTaskSchema>;

export const HighLevelTaskSchemaParser =
  StructuredOutputParser.fromZodSchema(HighLevelTaskSchema);

export const SearchResultsSchema = z.object({
  results: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.string().url(),
    })
  ),
});

export type SearchResults = z.infer<typeof SearchResultsSchema>;

export const SearchResultSchemaParser =
  StructuredOutputParser.fromZodSchema(SearchResultsSchema);

export const ResearchTaskSchema = z.object({
  topic: z.string(),
  keyFindings: z.array(z.string()),
  references: z.array(z.string().url()),
});

export type ResearchTask = z.infer<typeof ResearchTaskSchema>;

export const ResearchTaskSchemaParser =
  StructuredOutputParser.fromZodSchema(ResearchTaskSchema);

export const CrawlTaskSchema = z.object({
  urls: z.array(z.string().url()),
  depth: z.number(),
  base: z.number(),
  description: z.string({ description: "describe objective" }),
});

export type CrawlTask = z.infer<typeof CrawlTaskSchema>;

export const CrawlTaskSchemaParser =
  StructuredOutputParser.fromZodSchema(CrawlTaskSchema);

export const BrowserTaskSchema = z.object({
  steps: z.array(
    z.string({ description: "high level browser automation actions." })
  ),
  objective: z.string({ description: "objective from the task" }),
});

export type BrowserTask = z.infer<typeof BrowserTaskSchema>;

export const BrowserTaskSchemaParser =
  StructuredOutputParser.fromZodSchema(BrowserTaskSchema);
