"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Collaborators } from "../edit/collaborators";

export default function CollaboratorsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Collaborators</h1>
          <p className="text-muted-foreground">
            Manage who can access and edit this form.
          </p>
        </div>
        <Collaborators formId={id} />
      </div>
    </main>
  );
} 