"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import ZoomableImage from "@/components/ZoomableImage";
import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockFilename,
    CodeBlockFiles,
    CodeBlockItem,
} from "@/components/kibo-ui/code-block";

const mdComponents: Components = {
    h1: ({ children }) => (
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-8 mb-3">{children}</h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-7 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-xl md:text-2xl font-bold text-foreground mt-6 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
        <h4 className="text-lg md:text-xl font-bold text-foreground mt-5 mb-1">{children}</h4>
    ),
    h5: ({ children }) => (
        <h5 className="text-base font-bold text-foreground mt-4 mb-1">{children}</h5>
    ),
    h6: ({ children }) => (
        <h6 className="text-sm font-bold text-muted-foreground mt-3 mb-1">{children}</h6>
    ),
    a: ({ href, children }) => (
        <a href={href} className="link" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
    p: ({ children, node }) => {
        const BLOCK_TAGS = new Set(["div", "pre", "img", "table", "thead", "tbody", "tr", "th", "td", "ul", "ol", "li", "blockquote", "hr"]);
        const hasBlock = node?.children?.some(
            (child) => child.type === "element" && BLOCK_TAGS.has(child.tagName ?? "")
        ) ?? React.Children.toArray(children).some(
            (child) => React.isValidElement(child) && typeof child.type === "string" && BLOCK_TAGS.has(child.type)
        );
        if (hasBlock) return <div className="mb-4 leading-relaxed">{children}</div>;
        return <p className="mb-4 leading-relaxed">{children}</p>;
    },
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-secondary pl-4 my-4 text-muted-foreground italic">
            {children}
        </blockquote>
    ),
    pre: ({ children }) => {
        const codeEl = (children as React.ReactElement)?.props as { className?: string; children?: string } | undefined;
        const className = codeEl?.className ?? "";
        const language = className.replace("language-", "") || "text";
        const code = String(codeEl?.children ?? "").replace(/\n$/, "");

        return (
            <CodeBlock
                className="my-4"
                data={[{ language, filename: language, code }]}
                defaultValue={language}
            >
                <CodeBlockHeader>
                    <CodeBlockFiles>
                        {(item) => (
                            <CodeBlockFilename key={item.language} value={item.language}>
                                {item.filename}
                            </CodeBlockFilename>
                        )}
                    </CodeBlockFiles>
                    <CodeBlockCopyButton />
                </CodeBlockHeader>
                <CodeBlockBody>
                    {(item) => (
                        <CodeBlockItem key={item.language} value={item.language}>
                            <CodeBlockContent language={item.language as never}>
                                {item.code}
                            </CodeBlockContent>
                        </CodeBlockItem>
                    )}
                </CodeBlockBody>
            </CodeBlock>
        );
    },
    code: ({ className, children }) => {
        if (className) return <>{children}</>;
        return (
            <code
                className="font-['Victor_Mono',monospace] text-[0.875em] bg-muted border border-border rounded px-1 py-0.5 text-primary-lighter">
                {children}
            </code>
        );
    },
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    hr: () => <hr className="border-border my-8" />,
    img: ({ src, alt, width, height }) => (
        <ZoomableImage
            src={typeof src === "string" ? src : ""}
            alt={alt ?? ""}
            width={Number(width) || 800}
            height={Number(height) || 600}
            size="full"
            rounded="md"
        />
    ),
    table: ({ children }) => (
        <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }) => <thead className="bg-secondary">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
    th: ({ children }) => (
        <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border border-border px-3 py-2">{children}</td>
    ),
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    del: ({ children }) => <del className="line-through text-muted-foreground">{children}</del>,
};

export default function MarkdownRenderer({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={mdComponents}
        >
            {content}
        </ReactMarkdown>
    );
}
