import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { getAuthToken } from "@/lib/auth";
import { ResponsesPageClient } from "./responses-client";
import { responsesLoader } from "./_filters/searchParams";
import { SearchParams } from "nuqs/server";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const formId = ((await params).id as Id<"forms">) ?? null;
  const [token, filters] = await Promise.all([
    getAuthToken(),
    responsesLoader(searchParams),
  ]);

  if (!formId || !token) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Form not found or unauthorized</p>
      </div>
    );
  }

  const [preloadedResponses, preloadedForm, preloadedFields] =
    await Promise.all([
      preloadQuery(
        api.form_responses.getDetailedFormResponses,
        {
          formId,
          search: filters.search,
          field: filters.field,
          fieldValue: filters.fieldValue,
          date: filters.date,
        },
        { token },
      ),
      preloadQuery(api.forms.get, { formId }, { token }),
      preloadQuery(api.form_fields.getFormFields, { formId }, { token }),
    ]);

  return (
    <ResponsesPageClient
      formId={formId}
      preloadedForm={preloadedForm}
      preloadedFields={preloadedFields}
      preloadedResponses={preloadedResponses}
    />
  );
}
