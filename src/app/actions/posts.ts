"use server";

/**
 * Server actions for blog post draft management.
 *
 * Uses Neon serverless Postgres via Drizzle ORM.
 * DATABASE_URL must be set in your environment (use the pooled URL for
 * server actions; Neon's HTTP driver works fine without a persistent connection).
 *
 * Expects a `posts` table with at least:
 *   id         TEXT PRIMARY KEY
 *   title      TEXT
 *   slug       TEXT UNIQUE
 *   excerpt    TEXT
 *   content    TEXT
 *   tags       TEXT        -- JSON-encoded string array
 *   status     TEXT        -- "draft" | "published"
 *   updated_at TIMESTAMPTZ
 *   created_at TIMESTAMPTZ
 *   published_at TIMESTAMPTZ -- nullable
 *
 */

import { headers } from "next/headers";
import { timingSafeEqual } from "crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts } from "@/lib/db/schema";  // your Drizzle schema

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const ADMIN_USERNAME = "admin";

function safeCompare(a: string, b: string) {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);

    if (aBuffer.length !== bBuffer.length) {
        return false;
    }

    return timingSafeEqual(aBuffer, bBuffer);
}

async function assertAdmin() {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        throw new Error("ADMIN_PASSWORD is not configured");
    }

    const authorization = (await headers()).get("authorization");

    if (!authorization?.startsWith("Basic ")) {
        throw new Error("Unauthorized");
    }

    const encodedCredentials = authorization.slice("Basic ".length);
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf8");
    const separatorIndex = decodedCredentials.indexOf(":");

    if (separatorIndex === -1) {
        throw new Error("Unauthorized");
    }

    const username = decodedCredentials.slice(0, separatorIndex);
    const password = decodedCredentials.slice(separatorIndex + 1);

    if (
        username !== ADMIN_USERNAME ||
        !safeCompare(password, adminPassword)
    ) {
        throw new Error("Unauthorized");
    }
}

type SaveDraftInput = {
    id: string | null;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
};

type SaveDraftResult =
    | { success: true; id: string }
    | { success: false; error: string };

type PublishPostResult =
    | { success: true }
    | { success: false; error: string };

/**
 * Upsert a post draft. Creates a new row when `id` is null, updates
 * the existing row otherwise. Returns the post id on success.
 */
export async function savePostDraft(input: SaveDraftInput): Promise<SaveDraftResult> {
    try {
        await assertAdmin();

        const now = new Date();
        const tagsJson = JSON.stringify(input.tags);

        if (input.id) {
            // Update existing draft
            await db
                .update(posts)
                .set({
                    title: input.title,
                    slug: input.slug,
                    excerpt: input.excerpt,
                    content: input.content,
                    tags: tagsJson,
                    updatedAt: now,
                })
                .where(eq(posts.id, input.id));

            return { success: true, id: input.id };
        } else {
            // Insert new draft
            const id = nanoid();
            await db.insert(posts).values({
                id,
                title: input.title,
                slug: input.slug,
                excerpt: input.excerpt,
                content: input.content,
                tags: tagsJson,
                status: "draft",
                createdAt: now,
                updatedAt: now,
            });

            return { success: true, id };
        }
    } catch (error) {
        console.error("[savePostDraft]", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

type PostDraft = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    status: string;
    updatedAt: Date | string;
    createdAt: Date | string;
    publishedAt?: Date | string | null;
};

/**
 * Publish a post by id. Sets status to "published" and updates the timestamp.
 */
export async function publishPost(id: string): Promise<PublishPostResult> {
    try {
        await assertAdmin();

        const now = new Date();
        await db
            .update(posts)
            .set({
                status: "published",
                updatedAt: now,
                publishedAt: now,
            })
            .where(eq(posts.id, id));

        return {success: true};
    } catch (error) {
        console.error("[publishPost]", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Fetch a published post by slug for the public post page.
 * Returns null if not found or if the post is still a draft.
 */
export async function getPublishedPostBySlug(slug: string): Promise<PostDraft | null> {
    try {
        const rows = await db
            .select()
            .from(posts)
            .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
            .limit(1);

        const row = rows[0];
        if (!row) return null;

        return {
            ...row,
            tags: (() => {
                try {
                    return JSON.parse(row.tags ?? "[]");
                } catch {
                    return [];
                }
            })(),
        };
    } catch (error) {
        console.error("[getPublishedPostBySlug]", error);
        return null;
    }
}

/**
 * Fetch a draft post by slug for the preview page.
 * Returns null if not found.
 */
export async function getPostDraftBySlug(slug: string): Promise<PostDraft | null> {
    try {
        await assertAdmin();

        const rows = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1);

        const row = rows[0];
        if (!row) return null;

        return {
            ...row,
            tags: (() => {
                try {
                    return JSON.parse(row.tags ?? "[]");
                } catch {
                    return [];
                }
            })(),
        };
    } catch (error) {
        console.error("[getPostDraftBySlug]", error);
        return null;
    }
}
/**
 * Fetch a single draft by id.
 */
export async function getPostDraft(id: string): Promise<PostDraft | null> {
    try {
        await assertAdmin();

        const rows = await db
            .select()
            .from(posts)
            .where(eq(posts.id, id))
            .limit(1);

        const row = rows[0];
        if (!row) return null;

        return {
            ...row,
            tags: (() => {
                try { return JSON.parse(row.tags ?? "[]"); }
                catch { return []; }
            })(),
        };
    } catch (error) {
        console.error("[getPostDraft]", error);
        return null;
    }
}

type PostDraftSummary = {
    id: string;
    title: string;
    slug: string;
    status: string;
    updatedAt: Date | string;
};

/**
 * List all drafts (id, title, slug, status, updatedAt) for the load dialog.
 */
export async function listPostDrafts(): Promise<PostDraftSummary[]> {
    try {
        await assertAdmin();

        const rows = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                status: posts.status,
                updatedAt: posts.updatedAt,
            })
            .from(posts)
            .orderBy(posts.updatedAt);

        return rows.reverse(); // newest first
    } catch (error) {
        console.error("[listPostDrafts]", error);
        return [];
    }
}
