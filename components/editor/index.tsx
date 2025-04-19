"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { Image } from "@tiptap/extension-image";
import { ImageResize } from "tiptap-extension-resize-image";
import { useEditorStore } from "@/store/use-editor-store";
import { Underline } from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontSize } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import Placeholder from "@tiptap/extension-placeholder";


interface EditorProps {
  initialContent?: any;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const { setEditor } = useEditorStore();

  // Define editor class based on desired appearance
  const EDITOR_PAGE_CLASS = 
    "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none " +
    "bg-background rounded-lg p-8 md:p-12 min-h-[800px] shadow-lg border border-border";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableCell,
      TableHeader,
      TableRow,
      Image,
      ImageResize,
      Underline,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontSize,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: EDITOR_PAGE_CLASS,
      },
    },
  });

  useEffect(() => {
    setEditor(editor);
    return () => setEditor(null);
  }, [editor, setEditor]);

  useEffect(() => {
    if (editor && initialContent && editor.isEditable) {
      const currentContentJSON = JSON.stringify(editor.getJSON());
      const initialContentJSON = JSON.stringify(initialContent);

      if (currentContentJSON !== initialContentJSON) {
          setTimeout(() => {
            editor.commands.setContent(initialContent, false); 
          }, 0);
      }
    }
  }, [initialContent, editor]);

  return (
    // Removed the outer wrapper with bg-[#F9FBFD]
    // The main container div provides padding now (set in document.tsx)
    // Removed justify-center and specific width, editor will use container width
    <div className="w-full max-w-4xl mx-auto print:w-full print:max-w-none print:mx-0">
       {/* Ruler might be added back here if needed */}
      <EditorContent editor={editor} />
    </div>
  );
};
