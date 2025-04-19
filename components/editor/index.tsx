"use client";
import React, { useEffect, useState, DragEvent } from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { extractTextFromFile } from "@/lib/file-parser";

interface EditorProps {
  initialContent?: any;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const { setEditor } = useEditorStore();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Define editor class based on desired appearance and drag state
  const EDITOR_PAGE_CLASS = cn(
    "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none ",
    "bg-background rounded-lg p-8 md:p-12 min-h-[800px] shadow-lg border border-border transition-colors duration-200",
    isDraggingOver ? "border-primary border-dashed border-2" : "border-border"
  );

  const localEditor = useEditor({
    extensions: [
      StarterKit.configure({
      }),
      Placeholder.configure({
        placeholder: "Start typing or drop a file (.pdf, .docx, .txt)...",
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
      handleDOMEvents: {
        drop: (view, event) => {
          event.preventDefault();
          setIsDraggingOver(false);

          if (!event.dataTransfer) {
            return false;
          }

          const files = event.dataTransfer.files;
          if (files.length === 0 || !localEditor) {
            return false;
          }

          const file = files[0];
          if (!/pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|plain/i.test(file.type) && !/\.docx$|\.pdf$|\.txt$/i.test(file.name)) {
            toast.error("Unsupported file type. Please drop PDF, DOCX, or TXT.");
            return true;
          }

          toast.info(`Importing ${file.name} via drop...`);
          extractTextFromFile(file)
            .then(textOrHtmlContent => {
              if (!localEditor) return;
              const replaceContent = window.confirm(
                `Dropped "${file.name}".
(Note: Formatting may be simplified or lost, especially for PDFs.)

Press OK to replace the current content, or Cancel to append.`
              );

              if (replaceContent) {
                localEditor.chain().clearContent().setContent(textOrHtmlContent, true).focus().run();
                toast.success(`Replaced content with ${file.name}.`);
              } else {
                localEditor.chain().focus().insertContent(textOrHtmlContent, {
                  parseOptions: { preserveWhitespace: 'full' }
                }).run();
                toast.success(`Appended content from ${file.name}.`);
              }
            })
            .catch(error => {
              console.error("Error importing dropped file:", error);
              toast.error(`Failed to import ${file.name}. See console.`);
            });

          return true;
        },
        dragover: (view, event) => {
          event.preventDefault();
          setIsDraggingOver(true);
          return true;
        },
        dragleave: (view, event) => {
          setIsDraggingOver(false);
          return true;
        },
      },
    },
  });

  const { setEditor: setStoreEditor } = useEditorStore();
  useEffect(() => {
    setStoreEditor(localEditor);
    return () => setStoreEditor(null);
  }, [localEditor, setStoreEditor]);

  useEffect(() => {
    if (localEditor && initialContent && localEditor.isEditable) {
      const currentContentJSON = JSON.stringify(localEditor.getJSON());
      const initialContentJSON = JSON.stringify(initialContent);

      if (currentContentJSON !== initialContentJSON) {
        setTimeout(() => {
          localEditor.commands.setContent(initialContent, false);
        }, 0);
      }
    }
  }, [initialContent, localEditor]);

  return (
    <div className="w-full max-w-4xl mx-auto print:w-full print:max-w-none print:mx-0">
      <EditorContent editor={localEditor} />
    </div>
  );
};
