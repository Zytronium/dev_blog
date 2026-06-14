import Link from 'next/link';
import { neon } from '@neondatabase/serverless';
import type { Post } from '@/lib/db/schema';

type ParsedPost = Omit<Post, 'tags'> & { tags: string[] };

const sql = neon(process.env.DATABASE_URL!);

async function getRecentPosts(): Promise<ParsedPost[]> {
    const posts = await sql`
        SELECT slug, title, excerpt, tags, created_at as "createdAt", status
        FROM posts
        WHERE status = 'published'
        ORDER BY created_at DESC
        LIMIT 3
    `;
    return posts.map(post => ({
        ...post,
        tags: JSON.parse(post.tags as string) as string[],
    })) as ParsedPost[];
}

export default async function RecentPostsWidget() {
    const posts = await getRecentPosts();

    return (
        <section className="relative w-full">
            {/* Section label */}
            <div className="flex items-center gap-4 mb-6">
                <p className="text-xs tracking-[0.4em] uppercase shrink-0"
                   style={{ color: 'var(--secondary-bright)', fontFamily: "'Victor Mono', monospace" }}>
                    ◈ RECENT POSTS ◈
                </p>
                <div className="h-px flex-1"
                     style={{ background: 'linear-gradient(to right, var(--secondary), transparent)' }}
                />
            </div>

            {/* Post list */}
            {posts.length === 0 ? (
                <div className="py-10 text-center">
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: "'Victor Mono', monospace" }}>
                        No posts yet.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {posts.map((post, i) => (
                        <RecentPostRow key={post.slug} post={post} index={i} />
                    ))}
                </div>
            )}

            {/* Browse all button */}
            <div className="mt-6 flex justify-end">
                <Link
                    href="/browse"
                    className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-200"
                    style={{
                        fontFamily: "'Victor Mono', monospace",
                        color: 'var(--primary-lighter)',
                        border: '1px solid var(--primary)',
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                        background: 'rgba(26, 19, 64, 0.5)',
                    }}
                >
                    {/* Hover fill */}
                    <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(127,9,246,0.2) 0%, rgba(0,178,255,0.08) 100%)',
                            clipPath: 'inherit',
                        }}
                    />
                    <span className="relative">Browse all posts</span>
                    <span
                        className="relative transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: 'var(--secondary-bright)' }}
                    >
                        →
                    </span>
                </Link>
            </div>
        </section>
    );
}

function RecentPostRow({ post, index }: { post: ParsedPost; index: number }) {
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Link
            href={`/post/${post.slug}`}
            className="group relative flex items-start gap-4 px-4 py-4 transition-all duration-200"
            style={{
                background: 'rgba(26, 19, 64, 0.5)',
                border: '1px solid var(--primary)',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
                backdropFilter: 'blur(6px)',
            }}
        >
            {/* Hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, rgba(127,9,246,0.07) 0%, transparent 60%)',
                    clipPath: 'inherit',
                }}
            />

            {/* Index number */}
            <span
                className="relative shrink-0 text-xs pt-0.5 w-5 text-right select-none"
                style={{ color: 'var(--primary)', fontFamily: "'Victor Mono', monospace", opacity: 0.5 }}
            >
                {String(index + 1).padStart(2, '0')}
            </span>

            {/* Content */}
            <div className="relative flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <h3
                        className="text-sm font-bold leading-snug line-clamp-1 transition-colors duration-150"
                        style={{ color: 'var(--primary-lighter)', fontFamily: "'Aquire', sans-serif" }}
                    >
                        {post.title}
                    </h3>
                    <span
                        className="shrink-0 text-xs"
                        style={{ color: 'var(--muted-foreground)', fontFamily: "'Victor Mono', monospace" }}
                    >
                        {formattedDate}
                    </span>
                </div>

                {post.excerpt && (
                    <p
                        className="text-xs line-clamp-1"
                        style={{ color: 'var(--muted-foreground)' }}
                    >
                        {post.excerpt}
                    </p>
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                            <span
                                key={idx}
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                    background: 'rgba(127,9,246,0.15)',
                                    color: 'var(--secondary-bright)',
                                    border: '1px solid var(--secondary)',
                                    fontFamily: "'Victor Mono', monospace",
                                    fontSize: '0.6rem',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Arrow */}
            <span
                className="relative shrink-0 text-xs self-center opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0"
                style={{ color: 'var(--secondary-bright)', fontFamily: "'Victor Mono', monospace" }}
            >
                →
            </span>
        </Link>
    );
}
