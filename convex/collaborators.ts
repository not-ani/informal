import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { formMutation, formQuery } from "./helpers";

async function checkFormPermission(
  ctx: QueryCtx | MutationCtx,
  formId: Id<"forms">,
  requiredRole: "owner" | "editor" | "viewer" = "viewer",
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.subject) {
    throw new ConvexError("Not authenticated");
  }

  const form = await ctx.db.get(formId);
  if (!form) {
    throw new ConvexError("Form not found");
  }

  if (form.createdBy === identity.subject) {
    return {
      hasPermission: true,
      role: "owner" as const,
      userId: identity.subject,
    };
  }

  const collaboration = await ctx.db
    .query("collaborators")
    .withIndex("by_form_by_user", (q) =>
      q.eq("formId", formId).eq("userId", identity.subject),
    )
    .unique();

  if (!collaboration) {
    throw new ConvexError("You don't have permission to access this form");
  }

  const roleHierarchy: Record<"owner" | "editor" | "viewer", number> = {
    owner: 3,
    editor: 2,
    viewer: 1,
  };
  const userRoleLevel = roleHierarchy[collaboration.role];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  if (userRoleLevel < requiredRoleLevel) {
    throw new ConvexError(
      `Insufficient permissions. Required: ${requiredRole}, You have: ${collaboration.role}`,
    );
  }

  return {
    hasPermission: true,
    role: collaboration.role,
    userId: identity.subject,
  };
}

export const inviteCollaborator = formMutation({
  args: {
    formId: v.id("forms"),
    userId: v.string(),
    role: v.union(v.literal("editor"), v.literal("viewer")),
  },
  role: "owner",
  handler: async (ctx, args) => {
    const { userId } = await ctx;

    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_form_by_user", (q) =>
        q.eq("formId", args.formId).eq("userId", args.userId),
      )
      .unique();

    if (existingInvitation) {
      throw new ConvexError("Invitation already sent to this user");
    }

    const invitationId = await ctx.db.insert("invitations", {
      formId: args.formId,
      userId: args.userId,
      invitedBy: userId,
      role: args.role,
      status: "pending",
    });

    return invitationId;
  },
});

export const acceptInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      throw new ConvexError("Not authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.userId !== identity.subject) {
      throw new ConvexError("You can only accept your own invitations");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation has already been responded to");
    }

    await ctx.db.patch(args.invitationId, {
      status: "accepted",
      
    });

    return null;
  },
});

export const rejectInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      throw new ConvexError("Not authenticated");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.userId !== identity.subject) {
      throw new ConvexError("You can only reject your own invitations");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("Invitation has already been responded to");
    }

    await ctx.db.patch(args.invitationId, {
      status: "rejected",
    });

    return null;
  },
});

export const removeCollaborator = formMutation({
  args: {
    collaborationId: v.id("collaborators"),
  },
  role: "owner",
  handler: async (ctx, args) => {
    const collaborator = await ctx.db.get(args.collaborationId);
    if (!collaborator) {
      throw new ConvexError("Collaborator not found");  
    }
    await checkFormPermission(ctx, collaborator.formId, "owner");

    await ctx.db.delete(args.collaborationId);
    return null;
  },
});

export const updateCollaboratorRole = formMutation({
  args: {
    collaborationId: v.id("collaborators"),
    newRole: v.union(v.literal("editor"), v.literal("viewer")),
  },
  role: "owner",
  handler: async (ctx, args) => {
    const collaborator = await ctx.db.get(args.collaborationId);

    if (!collaborator) {
      throw new ConvexError("Collaborator not found");
    }

    await ctx.db.patch(args.collaborationId, {
      role: args.newRole,
    });

    return null;
  },
});

export const listCollaborators = formQuery({
  args: {
    formId: v.id("forms"),
  },
  role: "owner",
  handler: async (ctx, args) => {

    const collaborators = await ctx.db
      .query("collaborators")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    return collaborators;
  },
});

export const getFormPermissions = formQuery({
  args: {
    formId: v.id("forms"),
  },
  role: "viewer",
  handler: async (ctx) => {
    const { userRole } = await ctx;

      return {
        canView: true,
        canEdit: userRole === "owner" || userRole === "editor",
        canManageCollaborators: userRole === "owner",
        role: userRole,
      };
    
  },
});

export const getPendingInvitations = query({
  handler: async (ctx) => {

    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.subject) {
      throw new ConvexError("Not authenticated");
    }
      const pendingInvitations = await ctx.db
        .query("invitations")
        .withIndex("by_user", (q) =>
          q.eq("userId", identity.subject),
        )
        .collect();
   

    const enrichedInvitations = await Promise.all(pendingInvitations.map(async (invitation) => {
        const form = await ctx.db.get(invitation.formId);
        if (!form) {
          throw new ConvexError("Form not found");
        }
        return {
          _id: invitation._id,
          formId: invitation.formId,
          formName: form.title,
          role: invitation.role,
          invitedBy: invitation.invitedBy,
          invitedAt: invitation._creationTime,
        };
      }));

    return enrichedInvitations;
  },
});

export const getPendingInvitationForForm = query({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity?.email) {
      return null;
    }
    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new ConvexError("Form not found");
    }

    const pendingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_form_by_user", (q) =>
        q.eq("formId", args.formId).eq("userId", identity.subject),
      )
      .unique();

    if (!pendingInvitation) {
      return null;
    }

    
    return {
      _id: pendingInvitation._id,
      formId: pendingInvitation.formId,
      formName: form.title,
      role: pendingInvitation.role,
      invitedBy: pendingInvitation.invitedBy,
      invitedAt: pendingInvitation._creationTime,
    };
  },
});

export const getUserAccessibleForms = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity?.subject) {
      return [];
    }

    const ownedForms = await ctx.db
      .query("forms")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", identity.subject))
      .collect();

    const collaborations = await ctx.db
      .query("collaborators")
      .withIndex("by_user", (q) =>
        q.eq("userId", identity.subject),
      )
      .collect();

    const collaboratedForms = await Promise.all(
      collaborations.map(async (collab) => {
        const form = await ctx.db.get(collab.formId);
        return form ? { ...form, userRole: collab.role } : null;
      }),
    );

    const allForms = [
      ...ownedForms.map((form) => ({ ...form, userRole: "owner" as const })),
      ...collaboratedForms.filter(
        (form): form is NonNullable<typeof form> => form !== null,
      ),
    ];

    return allForms.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export { checkFormPermission };