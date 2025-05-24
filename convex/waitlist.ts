import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to add an email to the waitlist
export const joinWaitlist = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingEntry = await ctx.db
      .query("waitlist")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingEntry) {
      throw new Error("Email already on waitlist");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email format");
    }

    // Add to waitlist
    await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase().trim(),
    });

    return { success: true };
  },
});

// Query to get the total number of people on the waitlist
export const getWaitlistCount = query({
  args: {},
  handler: async (ctx) => {
    const count = await ctx.db.query("waitlist").collect();
    return count.length;
  },
});

// Query to check if an email is already on the waitlist
export const checkEmailExists = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existingEntry = await ctx.db
      .query("waitlist")
      .filter((q) => q.eq(q.field("email"), args.email.toLowerCase().trim()))
      .first();

    return !!existingEntry;
  },
});

// Query to get all waitlist entries (for admin purposes)
export const getAllWaitlistEntries = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("waitlist").collect();
  },
});