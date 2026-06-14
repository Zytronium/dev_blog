import { getPublishedPostBySlug } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Metadata } from "next";

type PageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id: slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) {
        return { title: "Post Not Found" };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt || undefined,
        },
    };
}

export default async function PostPage({ params }: PageProps) {
    const { id: slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) notFound();

    const formattedDate = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    return (
        <div className="min-h-screen relative overflow-hidden">

            {/* ── Background atmosphere ── */}
            <div className="fixed inset-0 pointer-events-none -z-10"
                 style={{
                     backgroundImage: `
                        linear-gradient(rgba(0,178,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,178,255,0.03) 1px, transparent 1px)
                     `,
                     backgroundSize: '40px 40px',
                 }}
            />
            <div className="fixed top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
                 style={{background: 'radial-gradient(circle, rgba(127,9,246,0.09) 0%, transparent 70%)'}}
            />
            <div className="fixed bottom-1/3 left-1/4 w-80 h-80 rounded-full pointer-events-none -z-10"
                 style={{background: 'radial-gradient(circle, rgba(0,178,255,0.07) 0%, transparent 70%)'}}
            />

            <article className="flex flex-col items-center px-6 py-12 md:px-16 lg:px-32 xl:px-64">

                {/* ── Back link ── */}
                <div className="w-full mb-10">
                    <Link
                        href="/browse"
                        className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-150"
                        style={{color: 'var(--primary)', fontFamily: "'Victor Mono', monospace"}}
                    >
                        <ArrowLeftIcon
                            size={12}
                            className="transition-transform duration-150 group-hover:-translate-x-1"
                        />
                        <span className="group-hover:underline underline-offset-4">All Posts</span>
                    </Link>
                </div>

                {/* ── Header ── */}
                <header className="w-full mb-10 flex flex-col gap-4">

                    {/* Eyebrow: date */}
                    <p className="text-xs tracking-[0.35em] uppercase"
                       style={{color: 'var(--secondary-bright)', fontFamily: "'Victor Mono', monospace"}}>
                        ◈ <time dateTime={new Date(post.createdAt).toISOString()}>{formattedDate}</time>
                    </p>

                    {/* Title */}
                    <h1 className="h1">
                        {post.title || <span className="text-muted-foreground italic">Untitled post</span>}
                    </h1>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="text-xs px-2 py-1 rounded"
                                    style={{
                                        background: 'rgba(127,9,246,0.15)',
                                        color: 'var(--secondary-bright)',
                                        border: '1px solid var(--secondary)',
                                        fontFamily: "'Victor Mono', monospace",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-px flex-1"
                             style={{background: 'linear-gradient(to right, var(--primary), transparent)'}}/>
                        <div className="w-1 h-1 rounded-full"
                             style={{background: 'var(--accent)'}}/>
                    </div>
                </header>

                {/* ── Content ── */}
                <div className="w-full">
                    {post.content?.trim() ? (
                        <MarkdownRenderer content={post.content} />
                    ) : (
                        <div className="text-center py-24"
                             style={{color: 'var(--muted-foreground)'}}>
                            <p className="text-lg italic mb-0">This post has no content yet.</p>
                        </div>
                    )}
                </div>

                {/* ── Footer nav ── */}
                <div className="w-full mt-16">
                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px flex-1"
                             style={{background: 'linear-gradient(to right, transparent, var(--primary))'}}/>
                        <span style={{color: 'var(--primary)', opacity: 0.4, fontFamily: "'Victor Mono', monospace", fontSize: '0.6rem'}}>
                            END OF LINE
                        </span>
                        <div className="h-px flex-1"
                             style={{background: 'linear-gradient(to left, transparent, var(--primary))'}}/>
                    </div>

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
                                background: 'linear-gradient(135deg, rgba(0,178,255,0.12) 0%, rgba(127,9,246,0.06) 100%)',
                                clipPath: 'inherit',
                            }}
                        />
                        <ArrowLeftIcon
                            size={12}
                            className="relative transition-transform duration-150 group-hover:-translate-x-1"
                        />
                        <span className="relative">Browse all posts</span>
                    </Link>
                </div>

            </article>
        </div>
    );
}
