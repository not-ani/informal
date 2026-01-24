import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { fieldTypeSchema } from "@/lib/utils";
import z from "zod";
import { Id } from "@convex/_generated/dataModel";

export const createFieldTool = (token: string) => tool({
  description: "Create a new field for a form",
  parameters: z.object({
    formId: z.string(),
    label: z.string(),
    type: fieldTypeSchema,
    required: z.boolean(),
    selectOptions: z.optional(
      z.array(
        z.object({
          name: z.string(),
          order: z.number(),
        }),
      ),
    ),
  }),
  execute: async ({
    formId,
    label,
    type,
    required,
    selectOptions,
  }) => {
    await fetchMutation(
      api.fields.create,
      {
        formId: formId as Id<"forms">,
        label: label,
        type: type as "text" | "textarea" | "number" | "select" | "multiselect" | "file",
        required,
        options: selectOptions?.map((option) => option.name),
      },
      {
        token,
      },
    );
    return "Field created successfully";
  },
}); 