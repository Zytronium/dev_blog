import { getPostDraftBySlug } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <div className="min-h-screen">
            {/* Preview banner */}
            <div className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-2.5 bg-secondary/20 border-b border-secondary/40 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-secondary-lighter uppercase tracking-widest bg-secondary/30 px-2 py-0.5 rounded">
                        Draft preview
                    </span>
                    <span className="text-muted-foreground text-xs hidden sm:block">
                        This is how your post will look when published.
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                >
                    <Link href={backHref}>
                        <PencilIcon size={12} /> Back to editor
                    </Link>
                </Button>
            </div>

            {/* Post content */}
            <article className="flex flex-col items-center px-6 py-12 md:px-16 lg:px-32 xl:px-64">
                <header className="w-full mb-8 flex flex-col gap-4">
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                                <Badge key={tag} className="bg-secondary/20 text-secondary-lighter border-secondary/40 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <h1 className="h1">
                        {post.title || <span className="text-muted-foreground italic">Untitled post</span>}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
                        <time dateTime={new Date().toISOString()}>{formattedDate}</time>
                        <span>·</span>
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded border border-border">
                            /post/{id}
                        </span>
                    </div>

                    <div className="border-t border-border mt-2" />
                </header>

                <div className="w-full">
                    {post.content?.trim() ? (
                        <MarkdownRenderer content={post.content} />
                    ) : (
                        <div className="text-center py-24 text-muted-foreground">
                            <p className="text-lg italic">No content yet — go write something!</p>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="mt-4 gap-1.5 border-primary text-primary hover:bg-primary/10"
                            >
                                <Link href={backHref}>
                                    <ArrowLeftIcon size={14} /> Back to editor
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
