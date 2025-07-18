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
      name: z.string().optional(),
      description: z.string().optional(),
      authRequired: z.boolean().optional(),
    }),
    execute: async ({ formId, name, description, authRequired }) => {
      const form = formId as Id<"forms">;
      await fetchMutation(
        api.forms.update,
        {
          formId: form,
          name,
          description,
          authRequired,
        },
        { token },
      );
      return "Form updated successfully";
    },
  });

