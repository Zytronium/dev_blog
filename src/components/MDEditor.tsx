"use client";

import { Editor, EditorFloatingMenuImageButton, JSONContent } from "@/components/kibo-ui/editor";
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
                <EditorFloatingMenuImageButton />
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
