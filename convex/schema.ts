import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("user")),
    banned: v.boolean(),
    createdAt: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  stages: defineTable({
    track: v.union(v.literal("ai"), v.literal("automation"), v.literal("vibe"), v.literal("engineering")),
    order: v.number(),
    title: v.string(),
    description: v.string(),
    externalUrl: v.optional(v.string()),
    steps: v.optional(v.array(v.object({
      title: v.string(),
      url: v.string(),
    }))),
    phase: v.optional(v.string()),
    adminLocked: v.optional(v.boolean()),
    questions: v.array(v.object({
      text: v.string(),
      type: v.union(v.literal("mcq"), v.literal("truefalse"), v.literal("open")),
      options: v.optional(v.array(v.string())),
      answer: v.string(),
    })),
  }).index("by_track", ["track"]),

  progress: defineTable({
    userId: v.string(),
    stageId: v.id("stages"),
    completed: v.boolean(),
    score: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
   .index("by_user_stage", ["userId", "stageId"]),

  comments: defineTable({
    stageId: v.id("stages"),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_stage", ["stageId"]),

  messages: defineTable({
    fromId: v.string(),
    toId: v.string(),
    fromName: v.string(),
    fromImage: v.optional(v.string()),
    content: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_conversation", ["fromId", "toId"])
    .index("by_to", ["toId"])
    .index("by_from", ["fromId"]),
});
