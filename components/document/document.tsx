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
    <div className="min-h-screen bg-[#FAFBFD]">
      <div className="flex flex-col px-4 pt-2 gap-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
        <Navbar data={document} />
        <Toolbar />
      </div>
      <div className="pt-[126px] print:pt-0">
        <Editor initialContent={document.content} />
      </div>
    </div>
  );
};
