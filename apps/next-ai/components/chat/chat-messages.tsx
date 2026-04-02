"use client";

import { RefObject } from "react";
import { Bot, Loader2, Sparkles, User } from "lucide-react";
import { UiChatMessage } from "./chat-types";

type ChatMessagesProps = {
  messages: UiChatMessage[];
  scrollRef: RefObject<HTMLDivElement | null>;
  emptyTitle: string;
  emptyDescription: string;
  isLoading?: boolean;
  userBubbleClassName?: string;
  assistantBubbleClassName?: string;
};

export function ChatMessages({
  messages,
  scrollRef,
  emptyTitle,
  emptyDescription,
  isLoading = false,
  userBubbleClassName = "rounded-br-md border-primary/20 bg-primary text-primary-foreground",
  assistantBubbleClassName = "rounded-bl-md bg-card text-card-foreground",
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{emptyTitle}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl border px-4 py-3 text-sm leading-6 shadow-sm ${
                  isUser ? userBubbleClassName : assistantBubbleClassName
                }`}
              >
                {message.content ? (
                  message.content
                ) : (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLoading ? "Réflexion en cours..." : ""}
                  </span>
                )}
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
