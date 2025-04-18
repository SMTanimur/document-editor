"use client";

import React from "react";
import { useDocumentStore } from "@/store";
import { Document as DocumentComponent } from "@/components/document/document";
import { Doc } from "@/types";

interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { documentId } = params;
  const document = useDocumentStore(state => state.documents[documentId]);

  if (!document) {
    console.error("Document not found in store:", documentId);
    return <div>Document not found</div>;
  }

  return <DocumentComponent document={document} />;
};

export default DocumentIdPage;
