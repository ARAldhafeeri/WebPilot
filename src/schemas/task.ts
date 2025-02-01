import { z } from "zod";
import { ActionStepSchema } from "./action";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const TaskSchema = z.object({
  objective: z.string().min(10).max(500),
  steps: z.array(ActionStepSchema).min(1),
  currentUrl: z.string().url(),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      viewport: z
        .object({
          width: z.number().default(1280),
          height: z.number().default(720),
        })
        .optional(),
    })
    .optional(),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskSchemaResponseParser =
  StructuredOutputParser.fromZodSchema(TaskSchema);

// high level task

export const HighLevelTaskSchema = z.object({
  description: z.string().min(10).max(500),
  urls: z.array(z.string().url()),
});

export type HighLevelTask = z.infer<typeof HighLevelTaskSchema>;

export const HighLevelTaskSchemaParser =
  StructuredOutputParser.fromZodSchema(HighLevelTaskSchema);
