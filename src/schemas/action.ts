import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

export const ActionStepSchema = z.object({
  action: z.enum(["click", "fill", "navigate", "hover", "scroll", "crawl"]),
  selector: z.string().optional(),
  text: z.string().optional(),
  url: z.string().optional().default(""),
  description: z.string(),
  waitForSelector: z.string().optional().default("body"),
  maxWaitTime: z.number().optional().default(30000),
  retryPolicy: z
    .object({
      maxAttempts: z.number().default(3),
      delay: z.number().default(1000),
    })
    .optional(),
});

export type ActionStep = z.infer<typeof ActionStepSchema>;

export const ActionSchemaResponseParser =
  StructuredOutputParser.fromZodSchema(ActionStepSchema);
