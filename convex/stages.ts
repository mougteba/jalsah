import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const trackValidator = v.union(
  v.literal("ai"),
  v.literal("automation"),
  v.literal("vibe"),
  v.literal("engineering")
);

const stepValidator = v.object({
  title: v.string(),
  url: v.string(),
});

const questionValidator = v.object({
  text: v.string(),
  type: v.union(v.literal("mcq"), v.literal("truefalse")),
  options: v.optional(v.array(v.string())),
  answer: v.string(),
});

export const getStagesByTrack = query({
  args: { track: trackValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stages")
      .withIndex("by_track", (q) => q.eq("track", args.track))
      .order("asc")
      .collect();
  },
});

export const getAllStages = query({
  handler: async (ctx) => {
    return await ctx.db.query("stages").collect();
  },
});

export const getTrackCount = query({
  args: { track: trackValidator },
  handler: async (ctx, args) => {
    const stages = await ctx.db
      .query("stages")
      .withIndex("by_track", (q) => q.eq("track", args.track))
      .collect();
    return stages.length;
  },
});

export const createStage = mutation({
  args: {
    track: trackValidator,
    order: v.number(),
    title: v.string(),
    description: v.string(),
    externalUrl: v.optional(v.string()),
    steps: v.optional(v.array(stepValidator)),
    phase: v.optional(v.string()),
    adminLocked: v.optional(v.boolean()),
    questions: v.array(questionValidator),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stages", args);
  },
});

export const toggleAdminLock = mutation({
  args: { stageId: v.id("stages"), locked: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.stageId, { adminLocked: args.locked });
  },
});

export const deleteStage = mutation({
  args: { stageId: v.id("stages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.stageId);
  },
});

export const updateStage = mutation({
  args: {
    stageId: v.id("stages"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    steps: v.optional(v.array(stepValidator)),
    phase: v.optional(v.string()),
    order: v.optional(v.number()),
    questions: v.optional(v.array(questionValidator)),
  },
  handler: async (ctx, args) => {
    const { stageId, ...fields } = args;
    await ctx.db.patch(stageId, fields);
  },
});
