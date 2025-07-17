import { streamText, convertToCoreMessages } from "ai";
import { google } from "@ai-sdk/google";
import * as Effect from "effect/Effect";

import { getAuthToken } from "@/lib/auth";
import { getTools } from "@/tools";

export const maxDuration = 30;

const errorToResponse = (error: unknown): Response =>
  new Response(
    error instanceof Error ? error.message : "An unknown error occurred",
    { status: 500 },
  );

export async function POST(req: Request): Promise<Response> {
  const program = Effect.gen(function* (_) {
    const { messages, formId } = yield* _(Effect.tryPromise(() => req.json()));

    const token = yield* _(Effect.tryPromise(getAuthToken));

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `
        You are an AI assistant that helps people create and manage forms. You are an AI-first Google Form.
        You must NEVER answer questions that are not related to form creation or management.


        IMPORTANT: Before performing any other action or answering questions about a specific form, you MUST first call the 'getFormInfo' tool to gather context about the form. Use the 'formId' provided in the user's request or context for this tool.

        You have access to the following tools:
        getFormInfo  – Get information and context about a specific form (call this first)
        createField  – Create a new field for a form
        updateField  – Update an existing field for a form
        deleteField  – Delete an existing field for a form
        createForm   – Create a new form
        updateForm   – Update an existing form
        deleteForm   – Delete an existing form
        updateForm   – Update an existing form 

        if you are in a untitled form with no fields or other info about the form, and you are asked to create a form to do x (or any variant of that request), assume that you are initializing a new form, call the "updateForm" tool to update the current empty form 
        with the new values (like changing the title or description).

        Call these tools with the requisite required parameters. We use Convex functions so the UI will update in real time.

        When the user asks to create a field with no extra info, set the default type to "text" and follow with appropriate values like "Untitled Question".

        If the user gives you a general premise, do your best to fill in values that are appropriate for the field. They can always ask to edit it again or change it themselves.

        The current formId is ${formId}
      `,
      messages: convertToCoreMessages(messages),
      maxSteps: 10,
      tools: getTools(token),
    });

    return result.toDataStreamResponse();
  }).pipe(
    Effect.catchAll((error) => Effect.succeed(errorToResponse(error))),
  );

  return Effect.runPromise(program);
}
