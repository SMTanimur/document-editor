import React, { useRef, useState, useEffect } from "react";

import { useDebounce } from "@/hooks";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { useDocumentStore } from "@/store";

interface DocumentInputProps {
  title: string;
  id: string;
}

export const DocumentInput = ({ title, id }: DocumentInputProps) => {
  const updateDocument = useDocumentStore(state => state.updateDocument);
  const [value, setValue] = useState(title);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing && title !== value) {
      setValue(title);
    }
  }, [title, isEditing, value]);

  const debounceUpdate = useDebounce((newValue: string) => {
    if (newValue === title || !newValue.trim()) {
      if (!isEditing) {
        setValue(title);
      }
      return;
    }
    setIsPending(true);
    try {
      const titleToUpdate = newValue.trim() || "Untitled Document";
      updateDocument({ id, title: titleToUpdate });
    } catch (error) {
      toast.error("Failed to update title");
      setValue(title);
      setIsPending(false);
    } finally {
      setTimeout(() => setIsPending(false), 300);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newValue = value.trim();
    if (newValue === title || !newValue) {
      setIsEditing(false);
      if (!newValue) setValue(title);
      return;
    }
    setIsPending(true);
    try {
      const titleToUpdate = newValue || "Untitled Document";
      updateDocument({ id, title: titleToUpdate });
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update title");
      setIsPending(false);
    } finally {
      setTimeout(() => setIsPending(false), 300);
    }
  };

  const handleBlur = () => {
    const newValue = value.trim();
    if (newValue !== title && newValue) {
      handleSubmit(new Event('submit', { cancelable: true }) as any);
    } else {
      if (!newValue) setValue(title);
      setIsEditing(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debounceUpdate(newValue);
  };

  const showLoader = isPending;

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="relative w-fit max-w-[50ch]">
          <span className="invisible whitespace-pre px-1.5 text-lg">
            {value || ""}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
            autoFocus
          />
        </form>
      ) : (
        <span
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => {
              inputRef.current?.focus();
              inputRef.current?.select();
            }, 0);
          }}
          className="text-lg px-1.5 cursor-pointer truncate"
        >
          {title}
        </span>
      )}
      {showLoader && (
        <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
      )}
    </div>
  );
};
