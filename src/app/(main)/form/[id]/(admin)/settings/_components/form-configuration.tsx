import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formSettingsSchema, type FormSettingsValues } from "./schemas";

interface FormConfigurationProps {
  formId: Id<"forms">;
  oneTime: boolean;
  authRequired: boolean;
}

export function FormConfiguration({ formId, oneTime, authRequired }: FormConfigurationProps) {
  const updateFormMutation = useMutation(api.forms.update);

  const form = useForm<FormSettingsValues>({
    resolver: zodResolver(formSettingsSchema),
    defaultValues: {
      oneTime,
      authRequired,
    },
    values: {
      oneTime,
      authRequired,
    },
  });

  const onSubmit = async (values: FormSettingsValues) => {
    try {
      await updateFormMutation({ 
        formId, 
        oneTime: values.oneTime,
        authRequired: values.authRequired,
      });
      toast.success("Form settings updated successfully");
    } catch (error) {
      console.error("Failed to update form settings:", error);
      toast.error("Failed to update form settings");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Configuration</CardTitle>
        <CardDescription>
          Configure how users can interact with your form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oneTime"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      One-Time Submissions
                    </FormLabel>
                    <FormDescription>
                      When enabled, users can only submit this form once. Otherwise, they can submit multiple times.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Require Authentication
                    </FormLabel>
                    <FormDescription>
                      When enabled, users must be logged in to submit this form. Otherwise, anonymous submissions are allowed.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 