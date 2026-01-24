import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { rateLimiter } from "./rateLimit";
import { formMutation, formQuery } from "./helpers";

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("reviewed"),
  v.literal("accepted"),
  v.literal("rejected")
);

const fileValueValidator = v.object({
  type: v.literal("file"),
  files: v.array(
    v.object({
      blobId: v.string(),
      path: v.string(),
      filename: v.string(),
      contentType: v.string(),
      sizeBytes: v.number(),
    })
  ),
});

const fieldResponseValueValidator = v.union(
  v.string(),
  v.array(v.string()),
  fileValueValidator
);

export const submit = mutation({
  args: {
    formId: v.id("forms"),
    applicantName: v.string(),
    applicantEmail: v.string(),
    fieldResponses: v.array(
      v.object({
        fieldId: v.id("formFields"),
        value: fieldResponseValueValidator,
      })
    ),
  },
  returns: v.id("responses"),
  handler: async (ctx, args) => {
    // Rate limit by email address to prevent spam: 10 submissions per hour per email
    await rateLimiter.limit(ctx, "submitForm", {
      key: args.applicantEmail.toLowerCase(),
      throws: true,
    });

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new ConvexError("Form not found");
    }
    if (!form.isPublished) {
      throw new ConvexError("This form is not accepting applications");
    }

    const fields = await ctx.db
      .query("formFields")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    const providedFieldIds = new Set(
      args.fieldResponses.map((r) => r.fieldId.toString())
    );

    for (const field of fields) {
      if (field.required && !providedFieldIds.has(field._id.toString())) {
        throw new ConvexError(`Required field "${field.label}" is missing`);
      }
    }

    const responseId = await ctx.db.insert("responses", {
      formId: args.formId,
      applicantName: args.applicantName,
      applicantEmail: args.applicantEmail,
      submittedAt: Date.now(),
      status: "pending",
    });

    for (const fieldResponse of args.fieldResponses) {
      const field = await ctx.db.get(fieldResponse.fieldId);
      if (!field || field.formId !== args.formId) {
        throw new ConvexError("Invalid field");
      }

      await ctx.db.insert("fieldResponses", {
        responseId,
        fieldId: fieldResponse.fieldId,
        value: fieldResponse.value,
      });
    }

    return responseId;
  },
});

export const list = formQuery({
  args: {
    formId: v.id("forms"),
    status: v.optional(statusValidator),
  },
  role: "viewer",
  returns: v.array(
    v.object({
      _id: v.id("responses"),
      _creationTime: v.number(),
      formId: v.id("forms"),
      submittedAt: v.number(),
      applicantName: v.string(),
      applicantEmail: v.string(),
      status: statusValidator,
    })
  ),
  handler: async (ctx, args) => {
    // biome-ignore lint/suspicious/noImplicitAnyLet: bro this rule isn't real
    let responses;

    if (args.status) {
      responses = await ctx.db
        .query("responses")
        .withIndex("by_form_and_status", (q) =>
          q.eq("formId", args.formId).eq("status", args.status!)
        )
        .collect();
    } else {
      responses = await ctx.db
        .query("responses")
        .withIndex("by_form", (q) => q.eq("formId", args.formId))
        .collect();
    }

    return responses.sort((a, b) => b.submittedAt - a.submittedAt);
  },
});

export const get = formQuery({
  args: {
    responseId: v.id("responses"),
  },
  returns: v.union(
    v.object({
      _id: v.id("responses"),
      _creationTime: v.number(),
      formId: v.id("forms"),
      submittedAt: v.number(),
      applicantName: v.string(),
      applicantEmail: v.string(),
      status: statusValidator,
      fieldResponses: v.array(
        v.object({
          fieldId: v.id("formFields"),
          fieldLabel: v.string(),
          fieldType: v.string(),
          value: fieldResponseValueValidator,
        })
      ),
    }),
    v.null()
  ),
  role: "viewer",
  handler: async (ctx, args) => {
    const response = await ctx.db.get(args.responseId);
    if (!response) {
      return null;
    }

    const fieldResponses = await ctx.db
      .query("fieldResponses")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .collect();

    const fieldIds = [...new Set(fieldResponses.map((fr) => fr.fieldId))];
    const fields = await Promise.all(fieldIds.map((id) => ctx.db.get(id)));

    const fieldMap = new Map(
      fields
        .filter((f): f is NonNullable<typeof f> => f !== null)
        .map((f) => [f._id.toString(), f]),
    );

    const enrichedResponses = fieldResponses.map((fr) => {
      const field = fieldMap.get(fr.fieldId.toString());
      return {
        fieldId: fr.fieldId,
        fieldLabel: field?.label ?? "Unknown",
        fieldType: field?.type ?? "text",
        value: fr.value,
      };
    });

    return {
      ...response,
      fieldResponses: enrichedResponses,
    };
  },
});

export const remove = formMutation({
  args: {
    responseId: v.id("responses"),
  },
  role: "editor",
  returns: v.null(),
  handler: async (ctx, args) => {
    const response = await ctx.db.get(args.responseId);
    if (!response) {
      throw new ConvexError("Response not found");
    }

    const fieldResponses = await ctx.db
      .query("fieldResponses")
      .withIndex("by_response", (q) => q.eq("responseId", args.responseId))
      .collect();

    for (const fr of fieldResponses) {
      await ctx.db.delete(fr._id);
    }

    await ctx.db.delete(args.responseId);

    return null;
  },
});
