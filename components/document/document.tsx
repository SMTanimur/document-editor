"use client";
import React from "react";
import { Navbar } from "../layouts";
import { Editor } from "../editor";
import { Toolbar } from "./toolbar";
import { Doc } from "@/types";


interface DocumentProps {
  document: Doc<"documents">;
}

export const Document = ({ document }: DocumentProps) => {
  if (!document) {
    return <div>Error loading document.</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="flex flex-col gap-2 fixed top-0 left-0 right-0 z-10 bg-background border-b px-4 py-2 print:hidden">
        <Navbar data={document} />
        <Toolbar />
      </div>
      <div className="pt-32 md:pt-28 px-4 md:px-8 print:pt-0 print:px-0 pb-12">
        <Editor initialContent={document.content} />
      </div>
    </div>
  );
};
