"use client";
import { usePreloadedQuery } from "convex/react";
import { PreloadedData } from "./types";
import { ResponseForm } from "./fields";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

export const FormPageClient = (props: {
  formId: string;
  preloadedData: PreloadedData;
  isOwner: boolean;
}) => {
  const data = usePreloadedQuery(props.preloadedData);

  return (
    <div className="h-screen relative container mx-auto">
      <h1 className="text-4xl font-bold pt-10"> {data.form.name} </h1>
      <ResponseForm fields={data.fields} formId={data.form._id} />

      {props.isOwner && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href={`/form/${props.formId}/edit`}>
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit Form
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
