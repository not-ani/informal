import { customMutation, customQuery } from "convex-helpers/server/customFunctions";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const formQuery = customQuery(query, {
	args: {
		formId: v.id("forms"),
	},
	input: async (
		ctx,
		args,
		{ role }: { role: "owner" | "editor" | "viewer" },
	) => {
		const userId = await ctx.auth.getUserIdentity();

		if (!userId?.subject) {
			throw new ConvexError("Unauthorized");
		}

		const form = await ctx.db.get(args.formId);

		if (!form) {
			throw new Error("Form not found");
		}

		const relationship = await ctx.db
			.query("collaborators")
			.withIndex("by_form_by_user", (q) =>
				q.eq("formId", args.formId).eq("userId", userId.subject),
			)
			.first();

		if (role === "owner") {
			if (relationship?.role !== "owner") {
				throw new ConvexError("Unauthorized");
			}
		} else if (role === "editor") {
			if (relationship?.role !== "editor" && relationship?.role !== "owner") {
				throw new ConvexError("Unauthorized");
			}
		} else if (role === "viewer") {
			if (
				relationship?.role !== "viewer" &&
				relationship?.role !== "editor" &&
				relationship?.role !== "owner"
			) {
				throw new ConvexError("Unauthorized");
			}
		} else {
			throw new ConvexError("Unauthorized");
		}

		return {
			ctx: {
				db: ctx.db,
				userId: userId.subject,
				form: form,
				relationship: relationship,
                userRole: relationship?.role,
			},
			args: args,
		};
	},
});


export const formMutation = customMutation(mutation, {
	args: {
		formId: v.id("forms"),
	},
	input: async (ctx, args, { role } : {role: "owner" | "editor" | "viewer"}) => {
		const userId = await ctx.auth.getUserIdentity();

		if (!userId?.subject) {
			throw new ConvexError("Unauthorized");
		}
        const form = await ctx.db.get(args.formId);
        if (!form) {
            throw new ConvexError("Form not found");
        }

		const relationship = await ctx.db.query("collaborators").withIndex("by_form_by_user", (q) => q.eq("formId", args.formId).eq("userId", userId.subject)).first();

		if (role === "owner") {
			if (relationship?.role !== "owner") {
				throw new ConvexError("Unauthorized");
			}
		} else if (role === "editor") {
			if (relationship?.role !== "editor" && relationship?.role !== "owner") {
				throw new ConvexError("Unauthorized");
			}
		} else if (role === "viewer") {
			if (relationship?.role !== "viewer" && relationship?.role !== "editor" && relationship?.role !== "owner") {
				throw new ConvexError("Unauthorized");
			}
		} else {
			throw new ConvexError("Unauthorized");
		}

		return {
			ctx: {
				db: ctx.db,
				userId: userId.subject,
				relationship: relationship,
                form: form,
			},
			args: args,
		};
	},
});