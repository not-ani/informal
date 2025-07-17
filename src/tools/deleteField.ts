import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import z from "zod";

export const deleteFieldTool = (token: string) => tool({
  description: "Delete an existing field for a form",
  parameters: z.object({
    fieldId: z.string(),
  }),
  execute: async ({ fieldId }) => {
    const fId = fieldId as Id<"form_fields">;
    await fetchMutation(
      api.form_fields.deleteField,
      {
        fieldId: fId,
      },
      {
        token,
      },
    );
    return "Field deleted successfully";
  },
}); 