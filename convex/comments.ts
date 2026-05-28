import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getComments = query({
  args: { stageId: v.id("stages") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_stage", (q) => q.eq("stageId", args.stageId))
      .order("asc")
      .collect();
  },
});

export const addComment = mutation({
  args: {
    stageId: v.id("stages"),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    content: v.string(),
    stageTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      stageId: args.stageId,
      userId: args.userId,
      userName: args.userName,
      userImage: args.userImage,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const getAllComments = query({
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").order("desc").collect();
    const enriched = await Promise.all(
      comments.map(async (c) => {
        const stage = await ctx.db.get(c.stageId);
        return { ...c, stageTitle: stage?.title ?? null };
      })
    );
    return enriched;
  },
});
