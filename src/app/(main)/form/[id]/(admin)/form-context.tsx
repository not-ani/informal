"use client";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import React from "react";

type FormContext = FunctionReturnType<typeof api.forms.get>;

export const FormContext = React.createContext<FormContext | null>(null);

export function FormContextProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const formContext = useQuery(api.forms.get, { formId: id as Id<"forms"> });

  if (!formContext) {
    return <div>Form not found</div>;
  }

  return (
    <FormContext.Provider value={formContext}>{children}</FormContext.Provider>
  );
}

export function useFormContext() {
  const context = React.useContext(FormContext);

  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }

  return context;
}
