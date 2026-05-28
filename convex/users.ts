import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_EMAIL = "almjtbymhmdalmkhtar@gmail.com";

export const createOrGetUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (existing) return existing._id;
    const role = args.email.toLowerCase() === ADMIN_EMAIL ? "admin" : "user";
    return await ctx.db.insert("users", {
      ...args,
      role,
      banned: false,
      createdAt: Date.now(),
    });
  },
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => u.role !== "admin" && u.email.toLowerCase() !== ADMIN_EMAIL);
  },
});

export const banUser = mutation({
  args: { userId: v.id("users"), banned: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { banned: args.banned });
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

export const setAdminRole = mutation({
  args: { userId: v.id("users"), role: v.union(v.literal("admin"), v.literal("user")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { role: args.role });
  },
});
