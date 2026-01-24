import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import z from "zod";

export const deleteFieldTool = (token: string) => tool({
  description: "Delete an existing field for a form",
  parameters: z.object({
    fieldId: z.string(),
    formId: z.string(),
  }),
  execute: async ({ fieldId, formId }) => {
    const fId = fieldId as Id<"formFields">;
    const form = formId as Id<"forms">;
    await fetchMutation(
      api.fields.remove,
      {
        fieldId: fId,
        formId: form,
      },
      {
        token,
      },
    );
    return "Field deleted successfully";
  },
}); 