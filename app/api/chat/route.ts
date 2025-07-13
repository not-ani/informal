import { streamText, tool, convertToCoreMessages } from "ai";
import { FieldType, fieldTypeSchema } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import z from "zod";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, formId } = await req.json();

    const token = await getAuthToken();

    if (!token) {
      return new Response((new Error("Unauthorized"))?.message, { status: 401 });
    }

    const result = streamText({
      model: google("gemini-2.0-flash"),
      system: `
      You are an AI assistant that helps people create and manage forms. You are an AI first google form.
      You must NEVER answer questions that are not related to form creation or management.

      IMPORTANT: Before performing any other action or answering questions about a specific form, you MUST first call the 'getFormInfo' tool to gather context about the form. Use the 'formId' provided in the user's request or context for this tool.

      You have access to the following tools:
      getFormInfo: Get information and context about a specific form. Call this first.
      createField: Create a new field for a form
      updateField: Update an existing field for a form
      deleteField: Delete an existing field for a form
      createForm: Create a new form
      updateForm: Update an existing form
      deleteForm: Delete an existing form

      Call these tools with the requisite required parameters. We use convex functions so the UI will update in real time.

      When the user asks to create a field with no extra info, set the default type to "text" and follow with appropriate values like "Untitled Question".

      If the user gives you a general premise, do your best to fill in values that are appropriate for the field. They can always ask to edit it again or change it themselves.

      the formId is ${formId}
    `,
      messages: convertToCoreMessages(messages),
      maxSteps: 10,
      tools: {
        getFormInfo: tool({
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
        }),
        createField: tool({
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
        }),
        updateField: tool({
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
            order,
            required,
            selectOptions,
          }) => {
            const fId = fieldId as Id<"form_fields">;
            const form = formId as Id<"forms">;
            const t = type as FieldType;
            await fetchMutation(
              api.form_fields.updateField,
              {
                formId: form,
                fieldId: fId,
                name,
                type: t,
                order,
                required,
                selectOptions,
              },
              {
                token,
              },
            );
            return "Field updated successfully";
          },
        }),
        deleteField: tool({
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
        }),
        deleteForm: tool({
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
        }),
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
