import { ConvexError, v } from "convex/values";

import { mutation } from "./_generated/server";
import { formMutation, formQuery } from "./helpers";

const conditionValidator = v.object({
  sourceFieldId: v.id("formFields"),
  operator: v.union(
    v.literal("equals"),
    v.literal("notEquals"),
    v.literal("contains"),
  ),
  value: v.union(v.string(), v.array(v.string())),
});

export const create = formMutation({
  args: {
    formId: v.id("forms"),
    title: v.string(),
    description: v.optional(v.string()),
    condition: v.optional(conditionValidator),
  },
  role: "editor",
  returns: v.id("formSections"),
  handler: async (ctx, args) => {
    const { form } = ctx;
    const existingSections = await ctx.db
      .query("formSections")
      .withIndex("by_form", (q) => q.eq("formId", form._id))
      .collect();
    const maxOrder = existingSections.reduce(
      (max, section) => Math.max(max, section.order),
      -1,
    );

    return await ctx.db.insert("formSections", {
      formId: form._id,
      title: args.title,
      description: args.description,
      order: maxOrder + 1,
      condition: args.condition,
    });

  },
});

export const update = mutation({
  args: {
    sectionId: v.id("formSections"),
    formId: v.id("forms"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    order: v.optional(v.number()),
    condition: v.optional(conditionValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {

    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    const { sectionId, ...updates } = args;
    await ctx.db.patch(sectionId, updates);
    return null;
  },
});

export const reorder = formMutation({
  args: {
    formId: v.id("forms"),
    sectionIds: v.array(v.id("formSections")),
  },
  role: "editor",
  returns: v.null(),
  handler: async (ctx, args) => {
    const { form } = ctx
    for (let i = 0; i < args.sectionIds.length; i++) {
      const sectionId = args.sectionIds[i];
      const section = await ctx.db.get(sectionId);
      if (!section) {
        throw new ConvexError(`Section ${sectionId} not found`);
      }
      if (section.formId !== form._id) {
        throw new ConvexError(`Section ${sectionId} does not belong to this form`);
      }
      await ctx.db.patch(sectionId, { order: i });
    }

    return null;
  },
});

export const remove = formMutation({
  args: {
    sectionId: v.id("formSections"),
    formId: v.id("forms"),
  },
  role: "editor",
  returns: v.null(),
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new ConvexError("Section not found");
    }

    const fields = await ctx.db
      .query("formFields")
      .withIndex("by_section", (q) => q.eq("sectionId", section._id))
      .collect();

    if (fields.length > 0) {
      throw new ConvexError(
        "Cannot delete section with fields. Move or delete fields first.",
      );
    }

    await ctx.db.delete(args.sectionId);
    return null;
  },
});

export const clearCondition = formMutation({
  args: {
    sectionId: v.id("formSections"),
    formId: v.id("forms"),
  },
  returns: v.null(),
  role: "editor",
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new ConvexError("Section not found");
    }

    await ctx.db.patch(args.sectionId, { condition: undefined });
    return null;
  },
});

export const listByFormId = formQuery({
  args: {
    formId: v.id("forms"),
  },
  returns: v.array(
    v.object({
      _id: v.id("formSections"),
      _creationTime: v.number(),
      formId: v.id("forms"),
      title: v.string(),
      description: v.optional(v.string()),
      order: v.number(),
      condition: v.optional(conditionValidator),
    }),
  ),
  role: "viewer",
  handler: async (ctx) => {
    return await ctx.db.query("formSections").withIndex("by_form", (q) => q.eq("formId", ctx.form._id)).collect();
  },
});
