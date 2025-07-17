import { tool } from "ai";
import { fetchMutation } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { fieldTypeSchema } from "@/lib/utils";
import z from "zod";

export const createFieldTool = (token: string) => tool({
  description: "Create a new field for a form",
  parameters: z.object({
    formId: z.string(),
    name: z.string(),
    type: fieldTypeSchema,
    order: z.number(),
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
    name,
    type,
    order,
    required,
    selectOptions,
  }) => {
    await fetchMutation(
      api.form_fields.addField,
      {
        formId,
        name,
        type,
        order,
        required,
        selectOptions,
      },
      {
        token,
      },
    );
    return "Field created successfully";
  },
}); 