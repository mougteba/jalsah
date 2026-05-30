import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const ADMIN_ID = "admin";

// جلب محادثة بين شخصين
export const getConversation = query({
  args: { userId: v.string(), otherUserId: v.string() },
  handler: async (ctx, args) => {
    const sent = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("fromId", args.userId).eq("toId", args.otherUserId)
      )
      .collect();
    const received = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("fromId", args.otherUserId).eq("toId", args.userId)
      )
      .collect();
    return [...sent, ...received].sort((a, b) => a.createdAt - b.createdAt);
  },
});

// جلب كل المحادثات للأدمن
export const getAllConversations = query({
  handler: async (ctx) => {
    const allMessages = await ctx.db.query("messages").collect();
    const convMap = new Map<string, any>();
    for (const msg of allMessages) {
      const userId = msg.fromId === ADMIN_ID ? msg.toId : msg.fromId;
      if (!convMap.has(userId) || msg.createdAt > convMap.get(userId).createdAt) {
        convMap.set(userId, msg);
      }
    }
    return Array.from(convMap.values()).sort((a, b) => b.createdAt - a.createdAt);
  },
});

// عدد الرسائل غير المقروءة للمستخدم
export const getUnreadCount = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("messages")
      .withIndex("by_to", (q) => q.eq("toId", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return unread.length;
  },
});

// إرسال رسالة
export const sendMessage = mutation({
  args: {
    fromId: v.string(),
    toId: v.string(),
    fromName: v.string(),
    fromImage: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});

// تعيين الرسائل كمقروءة
export const markAsRead = mutation({
  args: { userId: v.string(), fromId: v.string() },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("fromId", args.fromId).eq("toId", args.userId)
      )
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    await Promise.all(unread.map((m) => ctx.db.patch(m._id, { read: true })));
  },
});

// إرسال رسالة للجميع
export const broadcastMessage = mutation({
  args: {
    fromId: v.string(),
    fromName: v.string(),
    fromImage: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const nonAdmins = users.filter((u) => u.role !== "admin");
    await Promise.all(
      nonAdmins.map((u) =>
        ctx.db.insert("messages", {
          fromId: args.fromId,
          toId: u.clerkId,
          fromName: args.fromName,
          fromImage: args.fromImage,
          content: args.content,
          read: false,
          createdAt: Date.now(),
        })
      )
    );
  },
});
