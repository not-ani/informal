import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import z from "zod";

export const deleteFormTool = (token: string) => tool({
  description: "Delete an existing form",
  parameters: z.object({
    formId: z.string(),
  }),
  execute: async ({ formId }) => {
    const form = formId as Id<"forms">;
    await fetchMutation(
      api.forms.deleteForm,
      {
        formId: form,
      },
      {
        token,
      },
    );
    return "Form deleted successfully";
  },
}); 