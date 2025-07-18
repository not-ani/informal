import React from "react";
import { Collaborators } from "../edit/collaborators";
import { Id } from "@convex/_generated/dataModel";

export default async function CollaboratorsPage({ params }: { params: { id: string } }) {

  const { id } = await params;

  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Collaborators</h1>
          <p className="text-muted-foreground">
            Manage who can access and edit this form.
          </p>
        </div>
        <Collaborators formId={id as Id<"forms">} />
      </div>
    </main>
  );
} 