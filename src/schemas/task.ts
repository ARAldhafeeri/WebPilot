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
