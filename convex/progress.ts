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

export const getAllUsersProgress = query({
  handler: async (ctx) => {
    const allProgress = await ctx.db.query("progress").collect();
    const enriched = await Promise.all(
      allProgress.map(async (p) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", p.userId))
          .first();
        const stage = await ctx.db.get(p.stageId);
        return {
          ...p,
          userName: user?.name ?? "مجهول",
          userImage: user?.image,
          stageTitle: stage?.title ?? "—",
          stageTrack: stage?.track ?? "—",
        };
      })
    );
    return enriched.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  },
});

export const resetStageProgress = mutation({
  args: { stageId: v.id("stages") },
  handler: async (ctx, args) => {
    const records = await ctx.db.query("progress").collect();
    const toDelete = records.filter((p) => p.stageId === args.stageId);
    await Promise.all(toDelete.map((p) => ctx.db.delete(p._id)));
  },
});
