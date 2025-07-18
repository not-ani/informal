"use client";

import { useFormContext } from "../form-context";
import { FormInformation, FormConfiguration, DangerZone } from "./_components";

export default function Page() {
  const formContext = useFormContext();

  if (!formContext) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Form Settings</h1>
        <p className="text-muted-foreground">
          Manage your form settings and dangerous actions.
        </p>
      </div>

      <FormInformation 
        formName={formContext.name} 
        formId={formContext._id} 
      />

      <FormConfiguration
        formId={formContext._id}
        oneTime={formContext.oneTime ?? false}
        authRequired={formContext.authRequired ?? false}
      />

      <DangerZone formId={formContext._id} />
    </div>
  );
}
