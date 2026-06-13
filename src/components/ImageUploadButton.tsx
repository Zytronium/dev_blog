"use client";

import { useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    /** Called with the final ImageKit URL once upload succeeds */
    onInsert: (url: string, altText: string) => void;
    /** Optional: override the ImageKit /blog folder target */
    folder?: string;
    /** Optional: render a custom trigger element instead of the default icon button */
    trigger?: React.ReactNode;
}

export function ImageUploadButton({ onInsert, folder = "/blog", trigger }: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<"upload" | "url">("upload");

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [altText, setAltText] = useState("");
    const [externalUrl, setExternalUrl] = useState("");

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const picked = e.target.files?.[0] ?? null;
        setFile(picked);
        setError(null);
        if (picked) {
            const url = URL.createObjectURL(picked);
            setPreview(url);
        } else {
            setPreview(null);
        }
    }

    async function handleUpload() {
        if (!file) return;
        setUploading(true);
        setError(null);

        try {
            const form = new FormData();
            form.append("file", file);
            form.append("folder", folder);

            const res = await fetch("/api/imagekit/upload", {
                method: "POST",
                body: form,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error ?? `HTTP ${res.status}`);
            }

            const data: { url: string } = await res.json();
            onInsert(data.url, altText || file.name.replace(/\.[^.]+$/, ""));
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    }

    function handleInsertUrl() {
        if (!externalUrl.trim()) return;
        onInsert(externalUrl.trim(), altText || "image");
        handleClose();
    }

    function handleClose() {
        setOpen(false);
        // Defer reset so the closing animation isn't jarring
        setTimeout(() => {
            setFile(null);
            setPreview(null);
            setAltText("");
            setExternalUrl("");
            setError(null);
            setTab("upload");
        }, 200);
    }

    return (
        <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Insert image"
                        className="h-8 w-8"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Insert image</DialogTitle>
                </DialogHeader>

                {/* Tab bar */}
                <div className="flex gap-1 rounded-lg bg-muted p-1 text-sm">
                    {(["upload", "url"] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={[
                                "flex-1 rounded-md px-3 py-1.5 font-medium transition-colors",
                                tab === t
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground",
                            ].join(" ")}
                        >
                            {t === "upload" ? "Upload to ImageKit" : "Paste URL"}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {tab === "upload" ? (
                        <>
                            {/* Drop zone / file picker */}
                            <div
                                onClick={() => inputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const dropped = e.dataTransfer.files[0];
                                    if (dropped) {
                                        setFile(dropped);
                                        setPreview(URL.createObjectURL(dropped));
                                        setError(null);
                                    }
                                }}
                                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                            >
                                {preview ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="max-h-40 max-w-full rounded object-contain"
                                    />
                                ) : (
                                    <>
                                        <Upload className="h-6 w-6" />
                                        <span>
                      Drag & drop or click to select
                      <br />
                      <span className="text-xs">PNG, JPEG, GIF, WebP, SVG — max 10 MB</span>
                    </span>
                                    </>
                                )}
                            </div>

                            <input
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleFileChange}
                            />

                            <div className="space-y-1.5">
                                <Label htmlFor="ik-alt-upload">Alt text</Label>
                                <Input
                                    id="ik-alt-upload"
                                    placeholder="Describe the image"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button
                                type="button"
                                disabled={!file || uploading}
                                onClick={handleUpload}
                                className="w-full"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading…
                                    </>
                                ) : (
                                    "Upload & insert"
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor="ik-ext-url">Image URL</Label>
                                <Input
                                    id="ik-ext-url"
                                    type="url"
                                    placeholder="https://ik.imagekit.io/…"
                                    value={externalUrl}
                                    onChange={(e) => setExternalUrl(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ik-alt-url">Alt text</Label>
                                <Input
                                    id="ik-alt-url"
                                    placeholder="Describe the image"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                />
                            </div>

                            <Button
                                type="button"
                                disabled={!externalUrl.trim()}
                                onClick={handleInsertUrl}
                                className="w-full"
                            >
                                Insert
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
