"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll(
  messageCount: number,
  lastMessageContent: string,
  isLoading: boolean,
) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const raf = requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [messageCount, lastMessageContent, isLoading]);

  return scrollRef;
}
