import { getPostDraftBySlug } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ draft?: string }>;
};

export default async function PreviewPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { draft: draftId } = await searchParams;
    const post = await getPostDraftBySlug(id);

    if (!post) notFound();

    const backHref = draftId
        ? `/admin/new-post?draft=${draftId}`
        : "/admin/new-post";

    const formattedDate = new Date().toLocaleDateString("en-US", {
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

            {/* ── Preview banner ── */}
            <div className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-2.5 backdrop-blur-sm"
                 style={{
                     background: 'rgba(26, 19, 64, 0.85)',
                     borderBottom: '1px solid var(--secondary)',
                 }}>
                <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest px-2 py-0.5"
                          style={{
                              fontFamily: "'Victor Mono', monospace",
                              color: 'var(--secondary-bright)',
                              background: 'rgba(127,9,246,0.2)',
                              border: '1px solid var(--secondary)',
                          }}>
                        ◈ Draft Preview
                    </span>
                    <span className="hidden sm:block text-xs"
                          style={{color: 'var(--muted-foreground)', fontFamily: "'Victor Mono', monospace"}}>
                        This is how your post will look when published.
                    </span>
                </div>
                <Link
                    href={backHref}
                    className="group inline-flex items-center gap-1.5 text-xs tracking-widest uppercase transition-colors duration-150"
                    style={{color: 'var(--primary)', fontFamily: "'Victor Mono', monospace"}}
                >
                    <PencilIcon size={11} />
                    <span className="group-hover:underline underline-offset-4">Back to editor</span>
                </Link>
            </div>

            <article className="flex flex-col items-center px-6 py-12 md:px-16 lg:px-32 xl:px-64">

                {/* ── Header ── */}
                <header className="w-full mb-10 flex flex-col gap-4">

                    {/* Eyebrow: date + slug */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-xs tracking-[0.35em] uppercase mb-0"
                           style={{color: 'var(--secondary-bright)', fontFamily: "'Victor Mono', monospace"}}>
                            ◈ <time dateTime={new Date().toISOString()}>{formattedDate}</time>
                        </p>
                        <span style={{color: 'var(--muted-foreground)', opacity: 0.4}}>·</span>
                        <span className="text-xs px-2 py-0.5"
                              style={{
                                  fontFamily: "'Victor Mono', monospace",
                                  color: 'var(--muted-foreground)',
                                  background: 'rgba(26,19,64,0.8)',
                                  border: '1px solid var(--primary)',
                                  opacity: 0.7,
                              }}>
                            /post/{id}
                        </span>
                    </div>

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
                            <p className="text-lg italic mb-6">No content yet — go write something!</p>
                            <Link
                                href={backHref}
                                className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-200"
                                style={{
                                    fontFamily: "'Victor Mono', monospace",
                                    color: 'var(--primary-lighter)',
                                    border: '1px solid var(--primary)',
                                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                                    background: 'rgba(26, 19, 64, 0.5)',
                                }}
                            >
                                <span
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(0,178,255,0.12) 0%, rgba(127,9,246,0.06) 100%)',
                                        clipPath: 'inherit',
                                    }}
                                />
                                <PencilIcon size={12} className="relative" />
                                <span className="relative">Back to editor</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Footer nav ── */}
                <div className="w-full mt-16">
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
                        href={backHref}
                        className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-200"
                        style={{
                            fontFamily: "'Victor Mono', monospace",
                            color: 'var(--primary-lighter)',
                            border: '1px solid var(--primary)',
                            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                            background: 'rgba(26, 19, 64, 0.5)',
                        }}
                    >
                        <span
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(0,178,255,0.12) 0%, rgba(127,9,246,0.06) 100%)',
                                clipPath: 'inherit',
                            }}
                        />
                        <PencilIcon size={12} className="relative transition-transform duration-150 group-hover:scale-110" />
                        <span className="relative">Back to editor</span>
                    </Link>
                </div>

            </article>
        </div>
    );
}