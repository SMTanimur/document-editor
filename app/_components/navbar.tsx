"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { SearchInput } from "@/app/_components/search-input";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/store";
import { toast } from "sonner";

export const Navbar = () => {
  const router = useRouter();
  const addDocument = useDocumentStore(state => state.addDocument);
  
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
    <nav className="flex items-center justify-between h-full w-full">
      <div className="flex gap-3 items-center shrink-0 pr-6">
        <Link href={"/"}>
          <Image src="/logo.svg" alt="Logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl">Docs</h3>
      </div>
      <SearchInput />
      <div className="ml-auto">
        <Button onClick={onCreate} size="sm" className="rounded-full">
          <PlusIcon className="size-4 mr-2" />
          New
        </Button>
      </div>
    </nav>
  );
};
