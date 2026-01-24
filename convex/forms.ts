import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { formMutation, formQuery } from "./helpers";

export const create = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
	},
	returns: v.id("forms"),
	handler: async (ctx, args) => {
		const userId = await ctx.auth.getUserIdentity();

		if (!userId?.subject) {
			throw new ConvexError("Unauthorized");
		}

		const existing = await ctx.db.query("forms").unique();

		if (existing) {
			throw new ConvexError("Form already exists");
		}

		const formId = await ctx.db.insert("forms", {
			title: args.title,
			description: args.description,
			isPublished: false,
			createdBy: userId.subject,
		});

        await ctx.db.insert("collaborators", {
            formId: formId,
            userId: userId.subject,
            role: "owner",
        });

		return formId;
	},
});

export const update = formMutation({
	args: {
		formId: v.id("forms"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		isPublished: v.optional(v.boolean()),
	},
	role: "editor",
	returns: v.null(),
	handler: async (ctx, args) => {
		const form = ctx.form;
		if (!form) {
			throw new Error("Form not found");
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { formId, ...updates } = args;
		await ctx.db.patch(form._id, updates);
		return null;
	},
});

export const get = formQuery({
	args: {
		formId: v.id("forms"),
	},
	returns: v.union(
		v.object({
			_id: v.id("forms"),
			_creationTime: v.number(),
			title: v.string(),
			description: v.optional(v.string()),
			isPublished: v.boolean(),
			createdBy: v.string(),
		}),
		v.null(),
	),
	role: "viewer",
	handler: async (ctx) => {
		return ctx.form;
	},
});

export const getPublished = query({
	args: {
		formId: v.id("forms"),
	},
	returns: v.union(
		v.object({
			_id: v.id("forms"),
			_creationTime: v.number(),
			title: v.string(),
			description: v.optional(v.string()),
			isPublished: v.boolean(),
			createdBy: v.string(),
		}),
		v.null(),
	),
	handler: async (ctx, args) => {
		const form = await ctx.db.get(args.formId);
		if (!form || !form.isPublished) {
			throw new ConvexError("Form not found");
		}
		return form;
	},
});

export const listForUser = query({
	args: {
		userId: v.string(),
	},
	returns: v.array(
		v.object({
			_id: v.id("forms"),
			_creationTime: v.number(),
			title: v.string(),
			description: v.optional(v.string()),
			isPublished: v.boolean(),
			createdBy: v.string(),
		}),
	),
	handler: async (ctx, args) => {
		const forms = await ctx.db
			.query("forms")
			.withIndex("by_createdBy", (q) => q.eq("createdBy", args.userId))
			.collect();
		return forms;
	},
});

export const remove = formMutation({
	args: {
		formId: v.id("forms"),
	},
	returns: v.null(),
	role: "owner",
	handler: async (ctx) => {
		const responses = await ctx.db
			.query("responses")
			.withIndex("by_form", (q) => q.eq("formId", ctx.form._id))
			.collect();

		for (const response of responses) {
			const fieldResponses = await ctx.db
				.query("fieldResponses")
				.withIndex("by_response", (q) => q.eq("responseId", response._id))
				.collect();

			for (const fieldResponse of fieldResponses) {
				await ctx.db.delete(fieldResponse._id);
			}

			await ctx.db.delete(response._id);
		}

		const fields = await ctx.db
			.query("formFields")
			.withIndex("by_form", (q) => q.eq("formId", ctx.form._id))
			.collect();

		for (const field of fields) {
			await ctx.db.delete(field._id);
		}

		await ctx.db.delete(ctx.form._id);

		return null;
	},
});
