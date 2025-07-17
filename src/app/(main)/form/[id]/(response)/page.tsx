import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { FormPageClient } from "./_client/page.client";
import { getAuthToken } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const formId = ((await params).id as Id<"forms">) ?? null;
  const token = await getAuthToken();

  if (!formId) {
    return null;
  }

  const preloadedQuery = await preloadQuery(api.forms.getFormContext, {
    formId,
  });

  const isOwner = await fetchQuery(
    api.forms.checkFormOwnership,
    {
      formId,
    },
    {
      token,
    },
  );

  return (
    <div className="relative min-h-screen">
      <FormPageClient
        preloadedData={preloadedQuery}
        formId={formId}
        isOwner={isOwner}
      />
    </div>
  );
}
