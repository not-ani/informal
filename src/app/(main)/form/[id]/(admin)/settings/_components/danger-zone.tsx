import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
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
import { toast } from "sonner";

interface DangerZoneProps {
  formId: Id<"forms">;
}

export function DangerZone({ formId }: DangerZoneProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  
  const deleteFormMutation = useMutation(api.forms.deleteFormWithAllData);

  const handleDeleteForm = async () => {
    setIsDeleting(true);
    try {
      await deleteFormMutation({ formId });
      router.push("/app");
    } catch (error) {
      console.error("Failed to delete form:", error);
      toast.error("Failed to delete form");
      setIsDeleting(false);
      return; // Don't close dialog on error
    } finally {
      setIsDeleting(false);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
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
  );
} 