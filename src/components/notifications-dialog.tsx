"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, X, Mail, Clock, Users } from "lucide-react";

export function NotificationsDialog() {
  const [open, setOpen] = useState(false);

  const pendingInvitations = useQuery(api.collaborators.getPendingInvitations);

  const acceptInvitation = useMutation(api.collaborators.acceptInvitation);
  const rejectInvitation = useMutation(api.collaborators.rejectInvitation);

  const handleAccept = async (invitationId: Id<"form_collaborators">) => {
    try {
      await acceptInvitation({ collaborationId: invitationId });
      toast.success("Invitation accepted successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to accept invitation");
    }
  };

  const handleReject = async (invitationId: Id<"form_collaborators">) => {
    try {
      await rejectInvitation({ collaborationId: invitationId });
      toast.success("Invitation declined successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to decline invitation");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const invitationCount = pendingInvitations?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {invitationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {invitationCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
          <DialogDescription>
            {invitationCount > 0 
              ? `You have ${invitationCount} pending form invitation${invitationCount > 1 ? 's' : ''}`
              : "No pending notifications"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingInvitations && pendingInvitations.length > 0 ? (
            pendingInvitations.map((invitation) => (
              <Card key={invitation._id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-medium">
                        Form Collaboration Invite
                      </CardTitle>
                      <CardDescription className="text-xs">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          From: {invitation.invitedBy}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(invitation.invitedAt)}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      <Users className="h-3 w-3 mr-1" />
                      {invitation.role}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm">
                      You&apos;ve been invited to collaborate on{" "}
                      <span className="font-medium">{invitation.formName}</span> as a{" "}
                      <span className="font-medium">{invitation.role}</span>.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(invitation._id)}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(invitation._id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                No pending invitations
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 