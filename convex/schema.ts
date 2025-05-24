import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  waitlist: defineTable({
    email: v.string(),
  }),
  forms: defineTable({
    createdBy: v.string(),
    defaultRequired: v.optional(v.boolean()),
    description: v.optional(v.string()),
    name: v.optional(v.string()),
    slug: v.string(),
  }).index("by_slug", ["slug"]),
  form_responses: defineTable({
    formId: v.id("forms"),
    userEmail: v.optional(v.string()),
    slug: v.optional(v.string()),
  }).index("by_formId", ["formId"]),
  field_responses: defineTable({
    formId: v.id("forms"),
    fieldId: v.id("form_fields"),
    formResponseId: v.id("form_responses"),
    response: v.union(v.string(), v.array(v.string())),
  })
    .index("by_formId", ["formId"])
    .index("by_fieldId", ["fieldId"])
    .index("by_formResponseId", ["formResponseId"]),
  form_fields: defineTable({
    formId: v.string(),
    name: v.string(),
    order: v.float64(),
    required: v.optional(v.boolean()),
    selectOptions: v.optional(
      v.array(
        v.object({
          name: v.string(),
          order: v.float64(),
        }),
      ),
    ),
    type: v.union(
      v.literal("text"),
      v.literal("textarea"),
      v.literal("select"),
      v.literal("number"),
      v.literal("date"),
      v.literal("time"),
      v.literal("MCQ"),
      v.literal("checkbox"),
      v.literal("file"),
    ),
  }).index("by_formId", ["formId"]),
});
