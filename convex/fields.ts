import { ConvexError, v } from "convex/values";
import { formMutation, formQuery } from "./helpers";

const fieldTypeValidator = v.union(
  v.literal("text"),
  v.literal("textarea"),
  v.literal("number"),
  v.literal("select"),
  v.literal("multiselect"),
  v.literal("file")
);

const fileConfigValidator = v.object({
  maxSizeBytes: v.number(),
  allowedMimeTypes: v.array(v.string()),
  maxFiles: v.optional(v.number()),
});

const conditionValidator = v.object({
  sourceFieldId: v.id("formFields"),
  operator: v.union(
    v.literal("equals"),
    v.literal("notEquals"),
    v.literal("contains")
  ),
  value: v.union(v.string(), v.array(v.string())),
});

export const create = formMutation({
  args: {
    formId: v.id("forms"),
    sectionId: v.optional(v.id("formSections")),
    label: v.string(),
    description: v.optional(v.string()),
    type: fieldTypeValidator,
    required: v.boolean(),
    options: v.optional(v.array(v.string())),
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    fileConfig: v.optional(fileConfigValidator),
    condition: v.optional(conditionValidator),
  },
  role: "editor",
  returns: v.id("formFields"),
  handler: async (ctx, args) => {
    const { form } = ctx;
    const existingFields = await ctx.db
      .query("formFields")
      .withIndex("by_form", (q) => q.eq("formId", form._id))
      .collect();

    const maxOrder = existingFields.reduce(
      (max, field) => Math.max(max, field.order),
      -1
    );

    const fieldId = await ctx.db.insert("formFields", {
      formId: form._id,
      sectionId: args.sectionId,
      label: args.label,
      description: args.description,
      type: args.type,
      required: args.required,
      order: maxOrder + 1,
      options: args.options,
      min: args.min,
      max: args.max,
      fileConfig: args.fileConfig,
      condition: args.condition,
    });

    return fieldId;
  },
});

export const update = formMutation({
  args: {
    fieldId: v.id("formFields"),
    formId: v.id("forms"),
    sectionId: v.optional(v.id("formSections")),
    label: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(fieldTypeValidator),
    required: v.optional(v.boolean()),
    options: v.optional(v.array(v.string())),
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    fileConfig: v.optional(fileConfigValidator),
    condition: v.optional(conditionValidator),
  },
  returns: v.null(),
  role: "editor",
  handler: async (ctx, args) => {
    const { form } = ctx;
    const { fieldId, ...updates } = args;
    const field = await ctx.db.get(fieldId);
    if (!field) {
      throw new ConvexError("Field not found");
    }
    if (field.formId !== form._id) {
      throw new ConvexError("Field does not belong to this form");
    }
    await ctx.db.patch(fieldId, updates);
    return null;
  },
});

export const reorder = formMutation({
  args: {
    fieldIds: v.array(v.id("formFields")),
    formId: v.id("forms"),
  },
  role: "editor",
  returns: v.null(),
  handler: async (ctx, args) => {
    const { form } = ctx;

    for (let i = 0; i < args.fieldIds.length; i++) {
      const fieldId = args.fieldIds[i];
      const field = await ctx.db.get(fieldId);

      if (!field) {
        throw new ConvexError(`Field ${fieldId} not found`);
      }

      if (field.formId !== form._id) {
        throw new ConvexError(`Field ${fieldId} does not belong to this form`);
      }

      await ctx.db.patch(fieldId, { order: i });
    }

    return null;
  },
});

export const remove = formMutation({
  args: {
    fieldId: v.id("formFields"),
    formId: v.id("forms"),
  },
  returns: v.null(),
  role: "editor",
  handler: async (ctx, args) => {
    const { fieldId } = args;
    const { form } = ctx;
    const field = await ctx.db.get(fieldId);
    if (!field) {
      throw new ConvexError("Field not found");
    }
    if (field.formId !== form._id) {
      throw new ConvexError("Field does not belong to this form");
    }

    const fieldResponses = await ctx.db
      .query("fieldResponses")
      .withIndex("by_fieldId", (q) => q.eq("fieldId", fieldId))
      .collect();

    for (const response of fieldResponses) {
      await ctx.db.delete(response._id);
    }

    await ctx.db.delete(fieldId);

    return null;
  },
});

export const listByForm = formQuery({
  args: {
    formId: v.id("forms"),
  },
  returns: v.array(
    v.object({
      _id: v.id("formFields"),
      _creationTime: v.number(),
      formId: v.id("forms"),
      sectionId: v.optional(v.id("formSections")),
      label: v.string(),
      description: v.optional(v.string()),
      type: fieldTypeValidator,
      required: v.boolean(),
      order: v.number(),
      options: v.optional(v.array(v.string())),
      min: v.optional(v.number()),
      max: v.optional(v.number()),
      fileConfig: v.optional(fileConfigValidator),
      condition: v.optional(conditionValidator),
    })
  ),
  role:  "viewer",
  handler: async (ctx) => {
    const { form } = ctx;

    const fields = await ctx.db
      .query("formFields")
      .withIndex("by_form", (q) => q.eq("formId", form._id))
      .collect();

    return fields.sort((a, b) => a.order - b.order);
  },
});
