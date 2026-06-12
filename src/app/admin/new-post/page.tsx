"use client";

import MDEditor from "@/components/MDEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { savePostDraft, getPostDraft, listPostDrafts } from "@/app/actions/posts";
import {
    ExternalLinkIcon, SaveIcon, XIcon, EyeIcon,
    Loader2Icon, CheckIcon, FolderOpenIcon, ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type DraftSummary = {
    id: string;
    title: string;
    slug: string;
    status: string;
    updatedAt: Date | string;
};

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Inner component that uses useSearchParams (must be wrapped in Suspense)
function NewPostInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [postId, setPostId] = useState<string | null>(null);

    // Draft loader dialog
    const [draftsOpen, setDraftsOpen] = useState(false);
    const [draftList, setDraftList] = useState<DraftSummary[]>([]);
    const [draftsLoading, setDraftsLoading] = useState(false);

    // Initial content for the editor when loading a draft
        const [initialContent, setInitialContent] = useState<string | undefined>(undefined);
    const [editorKey, setEditorKey] = useState(0); // bump to remount editor with new content

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasContentRef = useRef(false);
    const skipNextAutosaveRef = useRef(false);

    // Load draft from ?draft=<id> on mount
    useEffect(() => {
        const draftId = searchParams.get("draft");
        if (!draftId) return;

        getPostDraft(draftId).then((post) => {
            if (!post) return;
            skipNextAutosaveRef.current = true;
            setPostId(post.id);
            setTitle(post.title);
            setSlug(post.slug);
            setSlugManuallyEdited(true);
            setExcerpt(post.excerpt);
            setContent(post.content);
            setTags(post.tags);
                setInitialContent(post.content);
            setEditorKey(k => k + 1);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally run once on mount only

    // Auto-generate slug from title unless manually edited
    useEffect(() => {
        if (!slugManuallyEdited) setSlug(slugify(title));
    }, [title, slugManuallyEdited]);

    const saveToDatabase = useCallback(async (data: {
        title: string; slug: string; excerpt: string;
        content: string; tags: string[]; postId: string | null;
    }) => {
        if (!data.title && !data.content.trim()) return;
        setSaveStatus("saving");
        try {
            const result = await savePostDraft({
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
                if (result.id && !data.postId) {
                    setPostId(result.id);
                    router.replace(`/admin/new-post?draft=${result.id}`, { scroll: false });
                }
                setTimeout(() => setSaveStatus("idle"), 2500);
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        }
    }, [router]);

    // Debounced autosave
    useEffect(() => {
        if (!hasContentRef.current && !title && !content.trim()) return;
        hasContentRef.current = true;

        if (skipNextAutosaveRef.current) {
            skipNextAutosaveRef.current = false;
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            saveToDatabase({ title, slug, excerpt, content, tags, postId });
        }, 1500);

        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [title, slug, excerpt, content, tags, postId, saveToDatabase]);

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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        saveToDatabase({ title, slug, excerpt, content, tags, postId });
    };

    const openDraftsDialog = async () => {
        setDraftsOpen(true);
        setDraftsLoading(true);
        const list = await listPostDrafts();
        setDraftList(list);
        setDraftsLoading(false);
    };

    const loadDraft = (draft: DraftSummary) => {
        setDraftsOpen(false);
        router.push(`/admin/new-post?draft=${draft.id}`);
        // The useEffect above will pick it up on navigation if the page remounts,
        // but since this is a client component we do it directly too:
        getPostDraft(draft.id).then((post) => {
            if (!post) return;
            skipNextAutosaveRef.current = true;
            setPostId(post.id);
            setTitle(post.title);
            setSlug(post.slug);
            setSlugManuallyEdited(true);
            setExcerpt(post.excerpt);
            setContent(post.content);
            setTags(post.tags);
                setInitialContent(post.content);
            setEditorKey(k => k + 1);
        });
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
                <h1 className="h2">New blog post</h1>
                <div className="flex items-center gap-3 flex-wrap pt-2">
                    {saveStatusEl}

                    {/* Load draft dialog */}
                    <Dialog open={draftsOpen} onOpenChange={setDraftsOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openDraftsDialog}
                                className="gap-2 border-muted-foreground text-muted-foreground hover:bg-muted/40"
                            >
                                <FolderOpenIcon size={14} /> Load draft
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Load a draft</DialogTitle>
                            </DialogHeader>
                            {draftsLoading ? (
                                <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                                    <Loader2Icon size={16} className="animate-spin" /> Loading drafts…
                                </div>
                            ) : draftList.length === 0 ? (
                                <p className="text-muted-foreground text-sm py-6 text-center">No drafts saved yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-1 max-h-96 overflow-y-auto">
                                    {draftList.map((draft) => (
                                        <li key={draft.id}>
                                            <button
                                                type="button"
                                                onClick={() => loadDraft(draft)}
                                                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted transition-colors flex flex-col gap-0.5 group"
                                            >
                                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {draft.title || <span className="italic text-muted-foreground">Untitled</span>}
                                                </span>
                                                <span className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                                    <span>/post/{draft.slug || "—"}</span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1">
                                                        <ClockIcon size={10} />
                                                        {new Date(draft.updatedAt).toLocaleString()}
                                                    </span>
                                                    {draft.status !== "draft" && (
                                                        <Badge className="text-[10px] py-0 h-4 bg-primary/20 text-primary border-primary/30">
                                                            {draft.status}
                                                        </Badge>
                                                    )}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualSave}
                        disabled={saveStatus === "saving"}
                        className="gap-2 border-secondary text-secondary-lighter hover:bg-secondary/10"
                    >
                        <SaveIcon size={14} /> Save draft
                    </Button>
                    {slug && postId && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-2 border-primary text-primary hover:bg-primary/10"
                        >
                            <Link href={`/admin/new-post/${slug}/preview?draft=${postId}`} target="_blank">
                                <EyeIcon size={14} /> Preview <ExternalLinkIcon size={12} />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Metadata fields */}
            <div className="w-full flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="title" className="text-primary-lighter font-['Aquire'] text-sm tracking-wide">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Give your post a title…"
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
                        <SaveIcon size={14} /> Save draft
                    </Button>
                    {slug && postId && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-2 border-primary text-primary hover:bg-primary/10"
                        >
                            <Link href={`/admin/new-post/${slug}/preview?draft=${postId}`} target="_blank">
                                <EyeIcon size={14} /> Preview <ExternalLinkIcon size={12} />
                            </Link>
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary-darker"
                        disabled={!title || !slug || !content.trim()}
                    >
                        Publish post
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function NewPostPage() {
    return (
        <Suspense>
            <NewPostInner />
        </Suspense>
    );
}
