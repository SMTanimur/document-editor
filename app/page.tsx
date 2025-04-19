/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Navbar } from "./_components/navbar";
import { TemplateGallery } from "./_components/template-gallery";
import { DocumentsTable } from "./_components/documents-table";
import { useDocumentStore, useSearchStore } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Home = () => {
  const router = useRouter();
  const { documents, addDocument } = useDocumentStore();
  const searchQuery = useSearchStore(state => state.searchQuery);

  const filteredDocuments = Object.values(documents).filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const status = "ReachedEnd" as const;
  const loadMore = () => {};

  const onCreate = () => {
    try {
      const id = addDocument("Untitled Document", "");
      router.push(`/documents/${id}`);
      toast.success("New document created");
    } catch (error) {
      toast.error("Failed to create document");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-background border-b p-4 print:hidden">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplateGallery />
        <DocumentsTable
          documents={filteredDocuments}
          loadMore={loadMore}
          status={status}
        />
      </div>
      
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={onCreate}
          className="
            w-14 h-14 rounded-full
            bg-blue-600 hover:bg-blue-700
            flex items-center justify-center
            shadow-lg hover:shadow-xl
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        ">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Home;
