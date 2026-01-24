import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { z } from "zod";

export const updateForm = (token: string) =>
  tool({
    description: "Update an existing form",
    parameters: z.object({
      formId: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
    execute: async ({ formId, title, description }) => {
      const form = formId as Id<"forms">;
      await fetchMutation(
        api.forms.update,
        {
          formId: form,
          title,
          description,
        },
        { token },
      );
      return "Form updated successfully";
    },
  });

