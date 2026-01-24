import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	...authTables,
	numbers: defineTable({
		value: v.number(),
	}),

	waitlist: defineTable({
		email: v.string(),
	}),

	collaborators: defineTable({
		formId: v.id("forms"),
		userId: v.string(),
		role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
	})
    .index("by_form", ["formId"])
    .index("by_user", ["userId"])
		.index("by_form_by_user", ["formId", "userId"]),

  invitations: defineTable({
    formId: v.id("forms"),
    userId: v.string(),
    invitedBy: v.string(),
    role: v.union(v.literal("owner"), v.literal("editor"), v.literal("viewer")),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
  })
    .index("by_form", ["formId"])
	.index("by_user", ["userId"])
    .index("by_form_by_user", ["formId", "userId"])
    .index("by_form_by_status", ["formId", "status"]),

	forms: defineTable({
		title: v.string(),
		description: v.optional(v.string()),
		isPublished: v.boolean(),
		createdBy: v.string(),
	})
		.index("by_published", ["isPublished"])
		.index("by_createdBy", ["createdBy"]),

	formSections: defineTable({
		formId: v.id("forms"),
		title: v.string(),
		description: v.optional(v.string()),
		order: v.number(),
		condition: v.optional(
			v.object({
				sourceFieldId: v.id("formFields"),
				operator: v.union(
					v.literal("equals"),
					v.literal("notEquals"),
					v.literal("contains"),
				),
				value: v.union(v.string(), v.array(v.string())),
			}),
		),
	})
		.index("by_form", ["formId"])
		.index("by_form_and_order", ["formId", "order"]),

	formFields: defineTable({
		formId: v.id("forms"),
		sectionId: v.optional(v.id("formSections")),
		label: v.string(),
		description: v.optional(v.string()),
		type: v.union(
			v.literal("text"),
			v.literal("textarea"),
			v.literal("number"),
			v.literal("select"),
			v.literal("multiselect"),
			v.literal("file"),
		),
		required: v.boolean(),
		order: v.number(),
		options: v.optional(v.array(v.string())),
		min: v.optional(v.number()),
		max: v.optional(v.number()),
		fileConfig: v.optional(
			v.object({
				maxSizeBytes: v.number(),
				allowedMimeTypes: v.array(v.string()),
				maxFiles: v.optional(v.number()),
			}),
		),
		condition: v.optional(
			v.object({
				sourceFieldId: v.id("formFields"),
				operator: v.union(
					v.literal("equals"),
					v.literal("notEquals"),
					v.literal("contains"),
				),
				value: v.union(v.string(), v.array(v.string())),
			}),
		),
	})
		.index("by_form", ["formId"])
		.index("by_form_and_order", ["formId", "order"])
		.index("by_section", ["sectionId"]),

	responses: defineTable({
		formId: v.id("forms"),
		submittedAt: v.number(),
		applicantEmail: v.string(),
		applicantName: v.string(),
		status: v.union(
			v.literal("pending"),
			v.literal("reviewed"),
			v.literal("accepted"),
			v.literal("rejected"),
		),
	})
		.index("by_form", ["formId"])
		.index("by_form_and_status", ["formId", "status"])
		.index("by_email", ["applicantEmail"]),

	fieldResponses: defineTable({
		responseId: v.id("responses"),
		fieldId: v.id("formFields"),
		value: v.union(
			v.string(),
			v.array(v.string()),
			v.object({
				type: v.literal("file"),
				files: v.array(
					v.object({
						blobId: v.string(),
						path: v.string(),
						filename: v.string(),
						contentType: v.string(),
						sizeBytes: v.number(),
					}),
				),
			}),
		),
	})
		.index("by_response", ["responseId"])
		.index("by_fieldId", ["fieldId"]),
});
