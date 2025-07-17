import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { ResponsesPageClient } from "./responses-client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const formId = ((await params).id as Id<"forms">) ?? null;
  const token = await getAuthToken();

  if (!formId || !token) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Form not found or unauthorized</p>
      </div>
    );
  }

    const preloadedResponses = await preloadQuery(
      api.form_responses.getDetailedFormResponses,
      { formId },
      { token }
    );

    const preloadedForm = await preloadQuery(
      api.forms.get,
      { formId },
      { token }
    );

    const preloadedFields = await preloadQuery(
      api.form_fields.getFormFields,
      { formId },
      { token }
    );

    return (
      <ResponsesPageClient
        formId={formId}
        preloadedResponses={preloadedResponses}
        preloadedForm={preloadedForm}
        preloadedFields={preloadedFields}
      />
    );
}
