import { tool } from "ai";
import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import z from "zod";

export const getFormInfoTool = (token: string) => tool({
  description: "Get form info",
  parameters: z.object({
    formId: z.string(),
  }),
  execute: async ({ formId }) => {
    const form = formId as Id<"forms">;
    const formInfo = await fetchQuery(
      api.forms.getFormContext,
      {
        formId: form,
      },
      {
        token,
      },
    );
    return formInfo;
  },
}); 