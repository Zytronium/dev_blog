import Link from 'next/link';
import {neon} from '@neondatabase/serverless';
import type { Post } from '@/lib/db/schema';

type ParsedPost = Omit<Post, 'tags'> & { tags: string[] };

const sql = neon(process.env.DATABASE_URL!, { fetchOptions: { cache: 'no-store' } });

async function getPosts(): Promise<ParsedPost[]> {
    const posts = await sql`
        SELECT slug, title, excerpt, tags, published_at as "publishedAt", status
        FROM posts
        WHERE status = 'published'
        ORDER BY published_at DESC
    `;
    return posts.map(post => ({
        ...post,
        tags: JSON.parse(post.tags as string) as string[],
    })) as ParsedPost[];
}

export default async function BrowsePage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
            {/* Scanline + grid background */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                     backgroundImage: `
                        linear-gradient(rgba(0,178,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,178,255,0.03) 1px, transparent 1px)
                    `,
                     backgroundSize: '40px 40px',
                 }}
            />
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
                 style={{background: 'radial-gradient(circle, rgba(127,9,246,0.12) 0%, transparent 70%)'}}
            />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
                 style={{background: 'radial-gradient(circle, rgba(0,178,255,0.10) 0%, transparent 70%)'}}
            />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center space-y-2 mb-12">
                    <h1 className="h1" style={{letterSpacing: '0.05em'}}>
                        Browse Posts
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-1">
                        <div className="h-px flex-1 max-w-24"
                             style={{background: 'linear-gradient(to right, transparent, var(--secondary))'}}/>
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                             style={{background: 'var(--accent)'}}/>
                        <div className="h-px flex-1 max-w-24"
                             style={{background: 'linear-gradient(to left, transparent, var(--secondary))'}}/>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post}/>
                    ))}
                </div>

                {/* Empty state */}
                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-sm" style={{color: 'var(--muted-foreground)'}}>
                            No posts found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface PostCardProps {
    post: ParsedPost;
}

function PostCard({post}: PostCardProps) {
    const formattedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }) : 'N/A';

    return (
        <Link
            href={`/post/${post.slug}`}
            className="group relative flex flex-col gap-4 px-6 py-6 transition-all duration-300 h-full"
            style={{
                background: 'rgba(26, 19, 64, 0.7)',
                border: '1px solid var(--primary)',
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                backdropFilter: 'blur(8px)',
            }}
        >
            {/* Hover glow overlay */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(127,9,246,0.08) 0%, transparent 60%)',
                    clipPath: 'inherit',
                }}
            />

            {/* Corner accent dots */}
            <div className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
                 style={{
                     borderTop: '2px solid var(--primary-lighter)',
                     borderRight: '2px solid var(--primary-lighter)',
                 }}
            />
            <div className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
                 style={{
                     borderBottom: '2px solid var(--primary)',
                     borderLeft: '2px solid var(--primary)',
                 }}
            />

            {/* Date */}
            <div className="text-xs tracking-wider"
                 style={{color: 'var(--muted-foreground)', fontFamily: "'Victor Mono', monospace"}}>
                {formattedDate}
            </div>

            {/* Title */}
            <h2 className="font-['Aquire'] text-xl font-bold transition-colors duration-200 line-clamp-2"
                style={{color: 'var(--primary-lighter)'}}>
                {post.title}
            </h2>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 overflow-hidden max-h-8">
                    {post.tags.map((tag: string, idx: number) => (
                        <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded"
                            style={{
                                background: 'rgba(127,9,246,0.15)',
                                color: 'var(--secondary-bright)',
                                border: '1px solid var(--secondary)',
                                fontFamily: "'Victor Mono', monospace"
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
                <p className="text-sm line-clamp-3 flex-1"
                   style={{color: 'var(--muted-foreground)'}}>
                    {post.excerpt}
                </p>
            )}

            {/* Read more arrow */}
            <div
                className="text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 mt-auto"
                style={{color: 'var(--primary)', fontFamily: "'Victor Mono', monospace"}}>
                READ MORE →
            </div>

            {/* Bottom scan line */}
            <div className="absolute bottom-0 left-4 right-4 h-px opacity-40"
                 style={{background: 'linear-gradient(to right, transparent, var(--primary), transparent)'}}
            />
        </Link>
    );
}

export const dynamic = 'force-dynamic';
