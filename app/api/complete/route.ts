import { api } from "@/convex/_generated/api";
import { autoCompleteSchema } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { streamObject } from "ai";
import { fetchQuery } from "convex/nextjs";
import { NextRequest } from "next/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, content } = body;

    const token = await convexAuthNextjsToken();

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const form = await fetchQuery(api.forms.getFormContext, {
      formId,
    });

    if (!form) {
      return new Response("Form not found", { status: 404 });
    }

    const result = streamObject({
      model: google("gemini-2.0-flash"),
      schema: autoCompleteSchema,
      prompt: `
      <task>
      Your are an AI assistant that helps people create and manage forms. You are an AI first google form.
      your job specifically is to assist with managing the form fields. Your provide autocompletion suggestions for the question name and type of field. You do this by returning an object 

      
      Rules:
      - USE the provided context in <context> tags
      - Read CAREFULLY the input text in <input> tags
      - Suggest a compeition for the input text (the name of the form field) and a type of field ("text", "textarea", "select", "number", "date", "time", "MCQ", "checkbox", "file")
      - Ensure suggestions maintain semantic meaning
      </task>

      <example>
      <input> "What is your name?" </input>
      <completion> { "type": "text" } </completion>
      </example>
      <example>
      <input> "Describe your experience with the product" </input>
      <completion> { "type": "textarea" } </completion>
      </example>
      
      <context>
      ${form.form.name}
      ${form.form.description}
      </context>
      <input>
      ${content}
      </input>
    `,
      temperature: 0.75,
      maxTokens: 50,
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
