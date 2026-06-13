"use client";

import { Editor, JSONContent } from "@/components/kibo-ui/editor";
import { useCurrentEditor } from "@tiptap/react";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import { ImageIcon } from "lucide-react";
import {
    EditorBubbleMenu,
    EditorCharacterCount,
    EditorClearFormatting,
    EditorFloatingMenu,
    EditorFormatBold,
    EditorFormatCode,
    EditorFormatItalic,
    EditorFormatStrike,
    EditorFormatSubscript,
    EditorFormatSuperscript,
    EditorFormatUnderline,
    EditorImageSelector,
    EditorLinkSelector,
    EditorNodeBulletList,
    EditorNodeCode,
    EditorNodeHeading1,
    EditorNodeHeading2,
    EditorNodeHeading3,
    EditorNodeOrderedList,
    EditorNodeQuote,
    EditorNodeTable,
    EditorNodeTaskList,
    EditorNodeText,
    EditorProvider,
    EditorSelector,
    EditorTableColumnAfter,
    EditorTableColumnBefore,
    EditorTableColumnDelete,
    EditorTableColumnMenu,
    EditorTableDelete,
    EditorTableFix,
    EditorTableGlobalMenu,
    EditorTableHeaderColumnToggle,
    EditorTableHeaderRowToggle,
    EditorTableMenu,
    EditorTableMergeCells,
    EditorTableRowAfter,
    EditorTableRowBefore,
    EditorTableRowDelete,
    EditorTableRowMenu,
    EditorTableSplitCell,
} from "@/components/kibo-ui/editor";
import { useState } from "react";
import { Markdown } from "tiptap-markdown";

// Bridges Tiptap editor context (from kibo-ui's EditorProvider) with ImageUploadButton.
// Must be rendered as a child of EditorProvider to access the editor via context.
function ImageUploadMenuButton() {
    const { editor } = useCurrentEditor();
    return (
        <ImageUploadButton
            folder="/blog"
            onInsert={(url, alt) =>
                editor?.chain().focus().setImage({ src: url, alt }).run()
            }
            trigger={
                <button
                    type="button"
                    title="Insert image"
                    className="flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    <ImageIcon className="h-4 w-4" />
                </button>
            }
        />
    );
}

// Types
export type MDEditorProps = {
    initialContent?: JSONContent | string;
    onContentChange?: (markdown: string) => void;
};

// Component
export default function MDEditor({ initialContent, onContentChange }: MDEditorProps = {}) {
    const [content, setContent] = useState<JSONContent | string>(
        initialContent ?? { type: "doc", content: [] }
    );

    const handleUpdate = ({ editor }: { editor: Editor }) => {
        const json = editor.getJSON();
        setContent(json);

        if (onContentChange) {
            const markdown = (
                (editor.storage as unknown as {
                    markdown: { getMarkdown: () => string };
                }).markdown.getMarkdown()
            );

            onContentChange(markdown);
        }
    };

    return (
        <EditorProvider
            className="h-full w-full overflow-y-auto rounded-lg border bg-background p-4"
            content={content}
            onUpdate={handleUpdate}
            placeholder="Start typing..."
            extensions={[Markdown.configure({ html: false, tightLists: true, transformPastedText: false })]}
        >
            <EditorFloatingMenu>
                <EditorNodeHeading1 hideName />
                <EditorNodeBulletList hideName />
                <EditorNodeQuote hideName />
                <EditorNodeCode hideName />
                <EditorNodeTable hideName />
                <ImageUploadMenuButton />
            </EditorFloatingMenu>
            <EditorBubbleMenu>
                <EditorSelector title="Text">
                    <EditorNodeText />
                    <EditorNodeHeading1 />
                    <EditorNodeHeading2 />
                    <EditorNodeHeading3 />
                    <EditorNodeBulletList />
                    <EditorNodeOrderedList />
                    <EditorNodeTaskList />
                    <EditorNodeQuote />
                    <EditorNodeCode />
                </EditorSelector>
                <EditorSelector title="Format">
                    <EditorFormatBold />
                    <EditorFormatItalic />
                    <EditorFormatUnderline />
                    <EditorFormatStrike />
                    <EditorFormatCode />
                    <EditorFormatSuperscript />
                    <EditorFormatSubscript />
                </EditorSelector>
                <EditorLinkSelector />
                <EditorImageSelector />
                <EditorClearFormatting />
            </EditorBubbleMenu>
            <EditorTableMenu>
                <EditorTableColumnMenu>
                    <EditorTableColumnBefore />
                    <EditorTableColumnAfter />
                    <EditorTableColumnDelete />
                </EditorTableColumnMenu>
                <EditorTableRowMenu>
                    <EditorTableRowBefore />
                    <EditorTableRowAfter />
                    <EditorTableRowDelete />
                </EditorTableRowMenu>
                <EditorTableGlobalMenu>
                    <EditorTableHeaderColumnToggle />
                    <EditorTableHeaderRowToggle />
                    <EditorTableDelete />
                    <EditorTableMergeCells />
                    <EditorTableSplitCell />
                    <EditorTableFix />
                </EditorTableGlobalMenu>
            </EditorTableMenu>
            <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
        </EditorProvider>
    );
}
