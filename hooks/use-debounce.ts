/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef } from "react";

export function useDebounce<
  T extends (...args: any[]) => any
>(callback: T, delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
