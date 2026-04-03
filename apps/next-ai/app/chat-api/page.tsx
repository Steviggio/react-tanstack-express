"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles } from "lucide-react";

import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatComposer } from "@/components/chat/chat-composer";
import { useAutoScroll } from "@/components/chat/use-auto-scroll";
import { UiChatMessage } from "@/components/chat/chat-types";

export default function ChatApiPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const uiMessages: UiChatMessage[] = useMemo(() => {
    return messages.map((message) => ({
      id: message.id,
      role: message.role === "user" ? "user" : "assistant",
      content: message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(""),
    }));
  }, [messages]);

  const lastMessageContent = uiMessages.at(-1)?.content ?? "";
  const scrollRef = useAutoScroll(
    uiMessages.length,
    lastMessageContent,
    isLoading,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = input.trim();
    if (!value || isLoading) return;

    await sendMessage({ text: value });
    setInput("");
  };

  return (
    <ChatLayout
      title="Assistant API"
      subtitle="Streaming en temps réel"
      status={isLoading ? "En génération..." : "Prêt"}
      icon={Sparkles}
      iconClassName="bg-primary/10 text-primary ring-primary/15"
      footer={
        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Écris ton message..."
          disabled={isLoading}
          isLoading={isLoading}
        />
      }
    >
      <ChatMessages
        messages={uiMessages}
        scrollRef={scrollRef}
        isLoading={isLoading}
        emptyTitle="Un assistant AI "
        emptyDescription="Pose une question pour tester le streaming."
      />
    </ChatLayout>
  );
}
