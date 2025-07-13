"use client";
import { Button } from "@/components/ui/button";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import React from "react";

export const New = () => {
  const createForm = useMutation(api.forms.create);
  const router = useRouter();

  const handleCreateClick = async () => {
    const newFormId = await createForm({});
    router.push(`/form/${newFormId}/edit`);
    return;
  };

  return (
    <Button className="bg-primary" onClick={handleCreateClick}>
      Create Form
    </Button>
  );
};
