"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { useSearchStore } from "@/store";

export const SearchInput = () => {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(localValue);
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    if (localValue !== searchQuery) {
      setSearchQuery(localValue);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="relative max-w-[720px] w-full">
        <Input
          value={localValue}
          onChange={handleChanges}
          onBlur={handleBlur}
          ref={inputRef}
          placeholder="Search documents..."
          className="md:text-base placeholder:text-muted-foreground px-14 w-full border focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)] bg-background rounded-full h-[48px] focus-visible:ring-primary/20 focus:bg-background"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 text-muted-foreground rounded-full"
        >
          <SearchIcon />
        </Button>
        {localValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 text-muted-foreground rounded-full"
            onClick={handleClear}
          >
            <XIcon />
          </Button>
        )}
      </form>
    </div>
  );
};
