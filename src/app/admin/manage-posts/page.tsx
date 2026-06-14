"use client";

import MDEditor from "@/components/MDEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getPublishedPost, listPublishedPosts, updatePublishedPost, archivePost } from "@/app/actions/posts";
import {
    ExternalLinkIcon, SaveIcon, XIcon, EyeIcon,
    Loader2Icon, CheckIcon, ArchiveIcon, ArrowLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type PostSummary = {
    id: string;
    title: string;
    slug: string;
    publishedAt: Date | string;
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function ManagePostsInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Post list
    const [postList, setPostList] = useState<PostSummary[]>([]);
    const [listLoading, setListLoading] = useState(true);

    // Editing state
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [initialContent, setInitialContent] = useState<string | undefined>(undefined);
    const [editorKey, setEditorKey] = useState(0);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasContentRef = useRef(false);
    const skipNextAutosaveRef = useRef(false);

    // Load post list on mount
    useEffect(() => {
        listPublishedPosts().then((list) => {
            setPostList(list);
            setListLoading(false);
        });
    }, []);

    // Load post from ?post=<id> on mount
    useEffect(() => {
        const postId = searchParams.get("post");
        if (!postId) return;
        loadPost(postId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-generate slug from title unless manually edited
    useEffect(() => {
        if (!slugManuallyEdited) setSlug(slugify(title));
    }, [title, slugManuallyEdited]);

    const loadPost = useCallback(async (id: string) => {
        const post = await getPublishedPost(id);
        if (!post) return;
        skipNextAutosaveRef.current = true;
        hasContentRef.current = false;
        setSelectedPostId(post.id);
        setTitle(post.title);
        setSlug(post.slug);
        setSlugManuallyEdited(true);
        setExcerpt(post.excerpt ?? "");
        setContent(post.content);
        setTags(post.tags);
        setInitialContent(post.content);
        setEditorKey(k => k + 1);
        setSaveStatus("idle");
        setLastSaved(null);
        router.replace(`/admin/manage-posts?post=${id}`, { scroll: false });
    }, [router]);

    const saveToDatabase = useCallback(async (data: {
        title: string; slug: string; excerpt: string;
        content: string; tags: string[]; postId: string;
    }) => {
        if (!data.title && !data.content.trim()) return;
        setSaveStatus("saving");
        try {
            const result = await updatePublishedPost({
                id: data.postId,
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                tags: data.tags,
            });
            if (result.success) {
                setSaveStatus("saved");
                setLastSaved(new Date());
                // Refresh the list title if it changed
                setPostList(prev => prev.map(p =>
                    p.id === data.postId ? { ...p, title: data.title, slug: data.slug } : p
                ));
                setTimeout(() => setSaveStatus("idle"), 2500);
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        }
    }, []);

    // Debounced autosave
    useEffect(() => {
        if (!selectedPostId) return;
        if (!hasContentRef.current && !title && !content.trim()) return;
        hasContentRef.current = true;

        if (skipNextAutosaveRef.current) {
            skipNextAutosaveRef.current = false;
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            saveToDatabase({ title, slug, excerpt, content, tags, postId: selectedPostId });
        }, 1500);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [title, slug, excerpt, content, tags, selectedPostId, saveToDatabase]);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase().replace(/,/g, "");
            if (newTag && !tags.includes(newTag)) setTags(prev => [...prev, newTag]);
            setTagInput("");
        } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
            setTags(prev => prev.slice(0, -1));
        }
    };

    const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

    const handleManualSave = () => {
        if (!selectedPostId) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        saveToDatabase({ title, slug, excerpt, content, tags, postId: selectedPostId });
    };

    const handleArchive = async () => {
        if (!selectedPostId) return;
        setSaveStatus("saving");
        try {
            const result = await archivePost(selectedPostId);
            if (result.success) {
                setPostList(prev => prev.filter(p => p.id !== selectedPostId));
                setSelectedPostId(null);
                setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setTags([]);
                setInitialContent(undefined);
                setEditorKey(k => k + 1);
                setSaveStatus("idle");
                router.replace("/admin/manage-posts", { scroll: false });
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        }
    };

    const saveStatusEl = (() => {
        if (saveStatus === "saving") return (
            <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Loader2Icon size={13} className="animate-spin" /> Saving…
            </span>
        );
        if (saveStatus === "saved") return (
            <span className="flex items-center gap-1.5 text-primary text-sm">
                <CheckIcon size={13} /> Saved
            </span>
        );
        if (saveStatus === "error") return (
            <span className="text-accent text-sm">Save failed — check connection</span>
        );
        if (lastSaved) return (
            <span className="text-muted-foreground text-xs">
                Last saved {lastSaved.toLocaleTimeString()}
            </span>
        );
        return null;
    })();

    return (
        <div className="flex flex-col items-center px-6 py-12 md:px-16 lg:px-32 xl:px-64 gap-8">
            {/* Header row */}
            <div className="w-full flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                    <h1 className="h2">Manage posts</h1>
                    {selectedPostId && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedPostId(null);
                                router.replace("/admin/manage-posts", { scroll: false });
                            }}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors self-start"
                        >
                            <ArrowLeftIcon size={11} /> Back to post list
                        </button>
                    )}
                </div>

                {selectedPostId && (
                    <div className="flex items-center gap-3 flex-wrap pt-2">
                        {saveStatusEl}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleManualSave}
                            disabled={saveStatus === "saving"}
                            className="gap-2 border-secondary text-secondary-lighter hover:bg-secondary/10"
                        >
                            <SaveIcon size={14} /> Save changes
                        </Button>

                        {slug && selectedPostId && (
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="gap-2 border-primary text-primary hover:bg-primary/10"
                            >
                                <Link href={`/post/${slug}`} target="_blank">
                                    <EyeIcon size={14} /> View live <ExternalLinkIcon size={12} />
                                </Link>
                            </Button>
                        )}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                                >
                                    <ArchiveIcon size={14} /> Archive
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Archive this post?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        &ldquo;{title}&rdquo; will be unpublished and moved to archived status. It won&apos;t be visible to readers, but the content won&apos;t be deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleArchive}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Archive post
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>

            {/* Post picker — shown when no post is selected */}
            {!selectedPostId && (
                <div className="w-full flex flex-col gap-4">
                    {listLoading ? (
                        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                            <Loader2Icon size={16} className="animate-spin" /> Loading posts…
                        </div>
                    ) : postList.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-center">
                            <p className="text-muted-foreground text-sm">No published posts yet.</p>
                            <Button asChild variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/10">
                                <Link href="/admin/new-post">Write your first post</Link>
                            </Button>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {postList.map((post) => (
                                <li key={post.id}>
                                    <button
                                        type="button"
                                        onClick={() => loadPost(post.id)}
                                        className="w-full text-left px-4 py-3.5 rounded-md hover:bg-muted transition-colors flex items-start justify-between gap-4 group border border-border hover:border-primary/40"
                                    >
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                                {post.title || <span className="italic text-muted-foreground">Untitled</span>}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono">
                                                /post/{post.slug || "—"}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-xs text-muted-foreground pt-0.5">
                                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago'
                                            })}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Editor — shown when a post is selected */}
            {selectedPostId && (
                <>
                    {/* Metadata fields */}
                    <div className="w-full flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="title" className="text-primary-lighter font-['Aquire'] text-sm tracking-wide">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Post title…"
                                className="bg-muted border-border text-foreground placeholder:text-muted-foreground text-lg h-12 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="slug" className="text-primary-lighter font-['Aquire'] text-sm tracking-wide">Slug</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm shrink-0">/post/</span>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={e => { setSlugManuallyEdited(true); setSlug(e.target.value); }}
                                    placeholder="post-url-slug"
                                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground font-mono focus-visible:ring-primary"
                                />
                            </div>
                            {slugManuallyEdited && (
                                <button
                                    type="button"
                                    onClick={() => { setSlugManuallyEdited(false); setSlug(slugify(title)); }}
                                    className="text-xs text-muted-foreground hover:text-primary underline self-start"
                                >
                                    Auto-generate from title
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="excerpt" className="text-primary-lighter font-['Aquire'] text-sm tracking-wide">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                placeholder="A short summary shown on the blog listing…"
                                rows={3}
                                className="bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="tags" className="text-primary-lighter font-['Aquire'] text-sm tracking-wide">Tags</Label>
                            <div className="flex flex-wrap items-center gap-2 min-h-10 px-3 py-2 rounded-md bg-muted border border-border focus-within:ring-2 focus-within:ring-primary">
                                {tags.map(tag => (
                                    <Badge key={tag} className="gap-1 bg-secondary/20 text-secondary-lighter border-secondary/40 hover:bg-secondary/30 cursor-default">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-accent ml-0.5" aria-label={`Remove tag ${tag}`}>
                                            <XIcon size={10} />
                                        </button>
                                    </Badge>
                                ))}
                                <input
                                    id="tags"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder={tags.length === 0 ? "Add tags — press Enter or comma to confirm…" : ""}
                                    className="flex-1 min-w-32 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag. Backspace removes the last one.</p>
                        </div>
                    </div>

                    <div className="w-full border-t border-border" />

                    <div className="w-full flex flex-col gap-2">
                        <Label className="text-primary-lighter font-['Aquire'] text-sm tracking-wide">Content</Label>
                        <div className="rounded-md border border-border bg-muted overflow-hidden">
                            <MDEditor
                                key={editorKey}
                                initialContent={initialContent}
                                onContentChange={setContent}
                            />
                        </div>
                    </div>

                    {/* Bottom action bar */}
                    <div className="w-full flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-border">
                        <div className="flex items-center gap-3">{saveStatusEl}</div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleManualSave}
                                disabled={saveStatus === "saving"}
                                className="gap-2 border-secondary text-secondary-lighter hover:bg-secondary/10"
                            >
                                <SaveIcon size={14} /> Save changes
                            </Button>
                            {slug && selectedPostId && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="gap-2 border-primary text-primary hover:bg-primary/10"
                                >
                                    <Link href={`/post/${slug}`} target="_blank">
                                        <EyeIcon size={14} /> View live <ExternalLinkIcon size={12} />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default function ManagePostsPage() {
    return (
        <Suspense>
            <ManagePostsInner />
        </Suspense>
    );
}
