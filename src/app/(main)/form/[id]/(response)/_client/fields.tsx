import { buildFormSchema } from "@/generator/lib";
import { QueryData } from "./types";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Form } from "@/components/ui/form";
import { DynamicFormFields } from "@/generator/ui";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Fields = QueryData["fields"];

export function ResponseForm({
  fields,
  formId,
}: {
  fields: Fields;
  formId: Id<"forms">;
}) {
  const { formSchema, defaultValues, nameToId } = buildFormSchema(fields);
  const submitApplication = useMutation(api.forms.submitResponse);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formResponseValues = Object.entries(values).map(
        ([name, value]) => ({
          id: nameToId[name],
          name,
          value: String(value),
        }),
      );

      await submitApplication({
        formId,
        formResponseValues,
      });
      toast.success("Application submitted successfully!");
      form.reset();
      router.push("/success");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4 container mx-auto  pt-10">
          <DynamicFormFields fields={fields} form={form} />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting…" : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
