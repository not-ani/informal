import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { fieldTypeSchema } from "@/lib/utils";
import z from "zod";

export const updateFieldTool = (token: string) => tool({
  description: "Update an existing field for a form",
  parameters: z.object({
    fieldId: z.string(),
    formId: z.string(),
    name: z.string().optional(),
    type: fieldTypeSchema,
    order: z.number().optional(),
    required: z.boolean().optional(),
    selectOptions: z
      .optional(
        z.array(
          z.object({
            name: z.string(),
            order: z.number(),
          }),
        ),
      )
      .optional(),
  }),
  execute: async ({
    fieldId,
    formId,
    name,
    type,
    required,
  }) => {
    const fId = fieldId as Id<"formFields">;
    const form = formId as Id<"forms">;
    await fetchMutation(
      api.fields.update,
      {
        formId: form,
        fieldId: fId,
        label: name,
        type: type as "text" | "textarea" | "number" | "select" | "multiselect" | "file",
        required,
      },
      {
        token,
      },
    );
    return "Field updated successfully";
  },
}); 