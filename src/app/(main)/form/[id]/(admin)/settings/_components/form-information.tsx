import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FormInformationProps {
  formName?: string;
  formId: string;
}

export function FormInformation({ formName, formId }: FormInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Information</CardTitle>
        <CardDescription>
          Basic information about your form.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Form Name</label>
          <p className="text-sm text-muted-foreground mt-1">
            {formName || "Untitled Form"}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Form ID</label>
          <p className="text-sm text-muted-foreground mt-1 font-mono">
            {formId}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 