import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addResponse = mutation({
  args: {
    formId: v.id("forms"),
    responses: v.array(
      v.object({
        fieldId: v.id("form_fields"),
        response: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const form = await ctx.db
      .query("forms")
      .withIndex("by_id", (q) => q.eq("_id", args.formId))
      .unique();
    if (!form) {
      throw new Error("Form not found");
    }
    const formResponseId = await ctx.db.insert("form_responses", {
      formId: form._id,
      userId: identity?.tokenIdentifier,
    });
    for (const response of args.responses) {
      await ctx.db.insert("field_responses", {
        formId: form._id,
        formResponseId: formResponseId,
        fieldId: response.fieldId,
        response: response.response,
      });
    }
    return formResponseId;
  },
});

export const getFormResponses = query({
  args: {
    formId: v.id("forms"),
  },
  returns: v.array(
    v.object({
      _id: v.id("form_responses"),
      userEmail: v.optional(v.string()),
      _creationTime: v.number(),
      fieldResponses: v.array(
        v.object({
          _id: v.id("field_responses"),
          fieldId: v.id("form_fields"),
          response: v.union(v.string(), v.array(v.string())),
        }),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return [];
    }

    const submissions = await ctx.db
      .query("form_responses")
      .withIndex("by_formId", (q) => q.eq("formId", args.formId))
      .order("desc")
      .collect();

    if (submissions.length === 0) {
      return [];
    }

    const formResponsesWithFields = await Promise.all(
      submissions.map(async (submission) => {
        const relatedFieldResponses = await ctx.db
          .query("field_responses")
          .withIndex("by_formResponseId", (q) =>
            q.eq("formResponseId", submission._id),
          )
          .collect();

        return {
          _id: submission._id,
          userId: submission.userId,
          _creationTime: submission._creationTime,
          fieldResponses: relatedFieldResponses.map((fr) => ({
            _id: fr._id,
            fieldId: fr.fieldId,
            response: fr.response,
          })),
        };
      }),
    );

    return formResponsesWithFields;
  },
});

