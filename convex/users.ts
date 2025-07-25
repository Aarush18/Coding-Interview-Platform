import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        image: v.optional(v.string()),
    },

    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
            .first();

        if (existingUser) {
            return;
        };

        await ctx.db.insert("users", {
            ...args,
            role: "candidate",
        })
    }
})

export const getUsers = query({
    handler: async (ctx) => {
    //   console.log("AUTH DEBUG", ctx.auth);
    //   const identity = await ctx.auth.getUserIdentity();
    //   if (!identity) {
    //     return [];
    //   }
      const users = await ctx.db.query("users").collect();
      return users;
    },
  });

export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        if (!args.clerkId) return null;
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq(("clerkId"), args.clerkId))
            .first();

        return user;
    },
})