import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const newFormId = await ctx.db.insert("forms", {
      createdBy: identity.tokenIdentifier,
      name: "Untitled Form",
      description: "This is a description",
    });

    return newFormId;
  },
});

export const getFormContext = query({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db
      .query("forms")
      .withIndex("by_id", (q) => q.eq("_id", args.formId))
      .unique();
    if (!form) {
      throw new Error("Form not found");
    }

    const fields = await ctx.db
      .query("form_fields")
      .withIndex("by_formId", (q) => q.eq("formId", args.formId))
      .collect();

    return {
      form,
      fields,
    };
  },
});

export const createForm = mutation({
  args: {
    createdBy: v.string(),
    name: v.string(),
    description: v.string(),
    defaultRequired: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const newFormId = await ctx.db.insert("forms", {
      createdBy: identity.tokenIdentifier,
      name: args.name,
      description: args.description,
      defaultRequired: args.defaultRequired,
    });
    return newFormId;
  },
});

export const update = mutation({
  args: {
    formId: v.id("forms"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("update", args);
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const form = await ctx.db
      .query("forms")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), args.formId),
        ),
      )
      .unique();


    if (!form) {
      console.log(form);
      throw new Error("Form not found");
    }

    await ctx.db.patch(args.formId, {
      name: args.name,
      description: args.description,
    });
  },
});

export const deleteForm = mutation({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const form = await ctx.db
      .query("forms")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), args.formId),
          q.eq(q.field("createdBy"), identity.tokenIdentifier),
        ),
      )
      .unique();
    if (!form) {
      throw new Error("Form not found");
    }
    const formResponses = await ctx.db
      .query("form_responses")
      .filter((q) => q.eq(q.field("formId"), args.formId))
      .collect();
    if (formResponses?.length > 0) {
      throw new ConvexError("Form has responses - cannot delete");
    }

    const formFields = await ctx.db
      .query("form_fields")
      .filter((q) => q.eq(q.field("formId"), args.formId))
      .collect();
    for (const field of formFields) {
      await ctx.db.delete(field._id);
    }
    await ctx.db.delete(args.formId);
  },
});

export const get = query({
  args: {
    formId: v.id("forms"),
  },
  handler: async (ctx, args) => {
    const form = await ctx.db
      .query("forms")
      .withIndex("by_id", (q) => q.eq("_id", args.formId))
      .unique();
    if (!form) {
      throw new Error("Form not found");
    }
    return form;
  },
});

export const getUserForms = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new Error("Not authenticated");
    }

    return ctx.db
      .query("forms")
      .filter((q) => q.eq(q.field("createdBy"), identity.tokenIdentifier))
      .collect();
  },
});
