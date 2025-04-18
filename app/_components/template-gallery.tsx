"use client";
import React, { useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { templates } from "@/constants";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/store";
import { toast } from "sonner";

export const TemplateGallery = () => {
  const router = useRouter();
  const addDocument = useDocumentStore(state => state.addDocument);
  const [isCreating, setIsCreating] = useState(false);

  const create = async ({ title, initialContent }: { title: string, initialContent: string }) => {
    try {
      return addDocument(title, initialContent);
    } catch (error) {
      throw new Error("Failed to create document");
    }
  };

  const onTemplateClick = async (title: string, initialContent: string) => {
    setIsCreating(true);
    await create({ title, initialContent })
      .catch(() => toast.error("Something went wrong"))
      .then((documentId) => {
        router.push(`/documents/${documentId}`);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  return (
    <div className="bg-[#F1F3F4]">
      <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-y-4">
        <h3 className="font-medium">Start a new Document</h3>
        <Carousel>
          <CarouselContent className="-ml-4">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-[14.285714%] pl-4"
              >
                <div
                  className={cn(
                    "aspect-[3/4] flex flex-col gap-y-2.5",
                    isCreating && "pointer-events-none opacity-50",
                  )}
                >
                  <button
                    disabled={isCreating}
                    onClick={() =>
                      onTemplateClick(template.label, template.initialContent)
                    } // TODO: Add initial content
                    style={{
                      backgroundImage: `url(${template.imageURL})`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="size-full hover:border-blue-500 rounded-sm border hover:bg-blue-50 transition flex flex-col items-center justify-center gap-y-4 bg-white"
                  />
                  <p className="text-sm font-medium truncate">
                    {template.label}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
