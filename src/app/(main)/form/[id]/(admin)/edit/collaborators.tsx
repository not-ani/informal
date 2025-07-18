"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Mail, Trash2, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["editor", "viewer"]),
});

interface CollaboratorsProps {
  formId: Id<"forms">;
}

export function Collaborators({ formId }: CollaboratorsProps) {
  const [isInviting, setIsInviting] = useState(false);

  const collaborators = useQuery(api.collaborators.listCollaborators, {
    formId: formId,
  });
  const permissions = useQuery(api.collaborators.getFormPermissions, {
    formId: formId,
  });

  const inviteCollaborator = useMutation(api.collaborators.inviteCollaborator);
  const removeCollaborator = useMutation(api.collaborators.removeCollaborator);
  const updateRole = useMutation(api.collaborators.updateCollaboratorRole);

  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "viewer",
    },
  });

  // Extract role toggle logic into a separate function
  const toggleRole = (currentRole: "owner" | "editor" | "viewer"): "editor" | "viewer" => {
    if (currentRole === "owner") {
      // Owners cannot have their roles changed, default to editor
      return "editor";
    }
    return currentRole === "editor" ? "viewer" : "editor";
  };

  const onInvite = async (values: z.infer<typeof inviteSchema>) => {
    try {
      await inviteCollaborator({
        formId: formId,
        userEmail: values.email,
        role: values.role,
      });
      toast.success("Invitation sent successfully!");
      form.reset();
      setIsInviting(false);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send invitation");
    }
  };

  const handleRemove = async (collaboratorId: Id<"form_collaborators">) => {
    try {
      await removeCollaborator({ collaborationId: collaboratorId });
      toast.success("Collaborator removed successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to remove collaborator");
    }
  };

  const handleRoleUpdate = async (
    collaboratorId: Id<"form_collaborators">,
    newRole: "editor" | "viewer",
  ) => {
    try {
      await updateRole({
        collaborationId: collaboratorId,
        newRole,
      });
      toast.success("Role updated successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to update role");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "editor":
        return "secondary";
      case "viewer":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Handle loading states
  if (permissions === undefined || collaborators === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Collaborators
          </CardTitle>
          <CardDescription>Loading collaborators...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!permissions?.canManageCollaborators) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Collaborators
          </CardTitle>
          <CardDescription>
            You don&apos;t have permission to manage collaborators for this
            form.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Collaborators
          </CardTitle>
          <CardDescription>
            Manage who can access and edit this form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isInviting ? (
            <Button
              onClick={() => setIsInviting(true)}
              className="flex w-full items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite Collaborator
            </Button>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onInvite)}
                className="space-y-4 p-4 border rounded-lg"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="colleague@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="viewer">
                            Viewer - Can view form and responses
                          </SelectItem>
                          <SelectItem value="editor">
                            Editor - Can edit form and view responses
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">Send Invitation</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsInviting(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {collaborators && collaborators.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Current Collaborators</h3>
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{collaborator.userEmail}</span>
                    </div>
                    <Badge variant={getRoleBadgeVariant(collaborator.role)}>
                      {collaborator.role}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(collaborator.status)}>
                      {collaborator.status}
                    </Badge>
                  </div>

                  {collaborator.status === "accepted" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleRoleUpdate(
                              collaborator._id,
                              toggleRole(collaborator.role),
                            )
                          }
                        >
                          Change to{" "}
                          {toggleRole(collaborator.role) === "viewer" ? "Viewer" : "Editor"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemove(collaborator._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {collaborator.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(collaborator._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {collaborators && collaborators.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No collaborators yet. Invite someone to get started!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function CollaboratorsDialog({ formId }: { formId: Id<"forms"> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4" />
          Invite Collaborator
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Collaborator</DialogTitle>
        </DialogHeader>
        <Collaborators formId={formId} />
      </DialogContent>
    </Dialog>
  );
}
