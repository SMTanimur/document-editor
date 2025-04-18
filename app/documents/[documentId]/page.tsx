"use client";

import React from "react";
import { useDocumentStore } from "@/store";
import { Document as DocumentComponent } from "@/components/document/document";
import { useParams } from "next/navigation";




const DocumentIdPage = () => {
  const { documentId } = useParams();
  const document = useDocumentStore(state => state.documents[documentId as string]);

  if (!document) {
    console.error("Document not found in store:", documentId);
    return <div>Document not found</div>;
  }

  return <DocumentComponent document={document} />;
};


export default DocumentIdPage;
