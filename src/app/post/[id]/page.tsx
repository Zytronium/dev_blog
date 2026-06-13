import { getPublishedPostBySlug } from "@/app/actions/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PageProps) {
    const { id: slug } = await params;
    const post = await getPublishedPostBySlug(slug);

    if (!post) notFound();

    const backHref = "/browse";

    const formattedDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString("en-US", {
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
        <div className="min-h-screen">
        {/* Post content */}
            <article className="flex flex-col items-center px-6 py-12 md:px-16 lg:px-32 xl:px-64">
                <header className="w-full mb-8 flex flex-col gap-4">
                    <h1 className="h1">
                        {post.title || <span className="text-muted-foreground italic">Untitled post</span>}
                    </h1>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
                        <time dateTime={new Date(post.createdAt).toISOString()}>{formattedDate}</time>
                        {post.tags && post.tags.length > 0 && (
                            <>
                                <span>·</span>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag: string) => (
                                        <Badge key={tag}
                                               className="bg-secondary/20 text-secondary-lighter border-secondary/40 text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="border-t border-border mt-2" />
                </header>

                <div className="w-full">
                    {post.content?.trim() ? (
                        <MarkdownRenderer content={post.content} />
                    ) : (
                        <div className="text-center py-24 text-muted-foreground">
                            <p className="text-lg italic">This post has no content.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="mt-4 gap-1.5 border-primary text-primary hover:bg-primary/10"
                            >
                                <Link href={backHref}>
                                    <ArrowLeftIcon size={14}/> Back to browse
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
