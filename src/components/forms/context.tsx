"use client";

import { createContext, useContext } from "react";
import { useQuery } from "convex/react";

import type { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";

interface FormContext {
  _id: Id<"forms">;
  title: string;
  description: string | undefined;
  isPublished: boolean;
  createdBy: string;
}

export const FormContext = createContext<FormContext>({
  _id: "" as Id<"forms">,
  title: "",
  description: undefined,
  isPublished: false,
  createdBy: "",
});

export const FormProvider = ({
  children,
  formId,
}: {
  children: React.ReactNode;
  formId: Id<"forms">;
}) => {
  const form = useQuery(api.forms.get, {
    formId,
  });

  if (!form) {
    return null;
  }

  return (
    <FormContext.Provider
      value={{
        _id: form._id,
        title: form.title,
        description: form.description,
        isPublished: form.isPublished,
        createdBy: form.createdBy,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);

  return context;
};
