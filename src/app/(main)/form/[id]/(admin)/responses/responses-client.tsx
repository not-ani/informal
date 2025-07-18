"use client";

import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Download } from "lucide-react";
import { FilterObject, FiltersPanel } from "./responses-filters";
import { ResponsesTable } from "./responses-table";
import { ResponsesEmptyState } from "./responses-empty-state";
import { parseAsString, useQueryStates } from "nuqs";

interface ResponsesPageClientProps {
  formId: Id<"forms">;
  preloadedForm: Preloaded<typeof api.forms.get>;
  preloadedFields: Preloaded<typeof api.form_fields.getFormFields>;
  preloadedResponses: Preloaded<typeof api.form_responses.getDetailedFormResponses>;
}

export function ResponsesPageClient({
  preloadedForm,
  preloadedFields,
  preloadedResponses,
}: ResponsesPageClientProps) {
  const form = usePreloadedQuery(preloadedForm);
  const fields = usePreloadedQuery(preloadedFields);

  const [filterObject, setFilterObject] = useQueryStates({
    search: parseAsString.withDefault(""),
    field: parseAsString.withDefault("all"),
    fieldValue: parseAsString.withDefault(""),
    date: parseAsString.withDefault("all"),
  });

  const responses = usePreloadedQuery(preloadedResponses);

  const fieldValues = useMemo(() => {
    if (filterObject.field === "all" || filterObject.field === "userEmail") return [];
    const values = new Set<string>();
    responses.forEach((response) => {
      response.fieldResponses.forEach((fieldResponse) => {
        if (fieldResponse.fieldId === filterObject.field) {
          if (Array.isArray(fieldResponse.response)) {
            fieldResponse.response.forEach((val: string) => values.add(val));
          } else {
            values.add(fieldResponse.response);
          }
        }
      });
    });
    return Array.from(values).filter(Boolean).sort();
  }, [responses, filterObject.field]);

  function exportToCSV() {
    if (responses.length === 0) return;
    const headers = ["Response ID", "User Email", "Submitted At"];
    fields.forEach((field) => headers.push(field.name));
    const rows = responses.map((response) => {
      const row = [
        response._id,
        response.userEmail || "Anonymous",
        format(new Date(response._creationTime), "yyyy-MM-dd HH:mm:ss")
      ];
      fields.forEach((field) => {
        const fieldResponse = response.fieldResponses.find((fr) => fr.fieldId === field._id);
        if (fieldResponse) {
          const responseText = Array.isArray(fieldResponse.response) 
            ? fieldResponse.response.join("; ")
            : fieldResponse.response;
          row.push(responseText);
        } else {
          row.push("");
        }
      });
      return row;
    });
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell: string) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form?.name || "form"}-responses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 container mx-auto" >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Form Responses</h1>
          <p className="text-muted-foreground">
            {form?.name || "Untitled Form"} • {responses.length} responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {responses.length} Total
          </Badge>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      <FiltersPanel
        filterObject={filterObject as FilterObject}
        setFilterObject={setFilterObject}
        fields={fields}
        fieldValues={fieldValues}
      />
      {responses.length === 0 ? (
        <ResponsesEmptyState responsesCount={responses.length} />
      ) : (
        <ResponsesTable filteredResponses={responses} fields={fields} />
      )}
    </div>
  );
} 