import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUserProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getTrackProgress = query({
  args: { userId: v.string(), track: v.union(v.literal("ai"), v.literal("automation"), v.literal("vibe"), v.literal("engineering")) },
  handler: async (ctx, args) => {
    const allProgress = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const stages = await ctx.db
      .query("stages")
      .withIndex("by_track", (q) => q.eq("track", args.track))
      .collect();
    const stageIds = new Set(stages.map((s) => s._id));
    return allProgress.filter((p) => stageIds.has(p.stageId));
  },
});

export const completeStage = mutation({
  args: {
    userId: v.string(),
    stageId: v.id("stages"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_stage", (q) =>
        q.eq("userId", args.userId).eq("stageId", args.stageId)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: true, score: args.score, completedAt: Date.now() });
    } else {
      await ctx.db.insert("progress", {
        userId: args.userId,
        stageId: args.stageId,
        completed: true,
        score: args.score,
        completedAt: Date.now(),
      });
    }
  },
});
