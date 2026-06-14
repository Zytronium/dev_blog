import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
    id:        text("id").primaryKey(),
    title:     text("title").notNull().default(""),
    slug:      text("slug").notNull().unique(),
    excerpt:   text("excerpt").notNull().default(""),
    content:   text("content").notNull().default(""),
    tags:      text("tags").notNull().default("[]"),
    status:    text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", {withTimezone: true}),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;