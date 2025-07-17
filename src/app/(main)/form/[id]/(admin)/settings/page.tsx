"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useFormContext } from "../form-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function Page() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formContext = useFormContext();
  const router = useRouter();
  
  const deleteFormMutation = useMutation(api.forms.deleteFormWithAllData);

  const handleDeleteForm = async () => {
    if (!formContext?._id) return;
    
    setIsDeleting(true);
    try {
      await deleteFormMutation({ formId: formContext._id });
      router.push("/app");
    } catch (error) {
      console.error("Failed to delete form:", error);
      // You might want to show a toast notification here
    } finally {
      router.push("/app");
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

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
              {formContext.name || "Untitled Form"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Form ID</label>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {formContext._id}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions for this form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <div>
              <h3 className="font-medium text-destructive">Delete Form</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Permanently delete this form and all associated data including responses.
              </p>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Form
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">Delete Form</DialogTitle>
                  <DialogDescription>
                    Are you absolutely sure you want to delete this form?
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      This action will permanently remove:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>The form and all its fields</li>
                      <li>All form responses from users</li>
                      <li>All individual field responses</li>
                      <li>Any associated form data</li>
                    </ul>
                  </div>
                  <div className="font-medium text-destructive text-sm">
                    This action cannot be undone and all data will be permanently lost.
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteForm}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Form Permanently"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
