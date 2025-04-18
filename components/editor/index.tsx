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
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-4 min-h-[500px] w-full bg-white border border-gray-300",
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
    <div className="size-full overflow-x-auto w-[816px] bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
  
      <div className="flex justify-center py-4 print:py-0 mx-auto  w-full">
        <EditorContent editor={editor}  className="w-full"/>
      </div>
    </div>
  );
};
