"use client";

import { useState } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import { Zap } from "lucide-react";

import { generateAnswer } from "../actions";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatComposer } from "@/components/chat/chat-composer";
import { useAutoScroll } from "@/components/chat/use-auto-scroll";
import { UiChatMessage } from "@/components/chat/chat-types";

export default function ChatRSCPage() {
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const lastMessageContent = messages.at(-1)?.content ?? "";
  const scrollRef = useAutoScroll(
    messages.length,
    lastMessageContent,
    isLoading,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = input.trim();
    if (!value || isLoading) return;

    const userMessage: UiChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: value,
    };

    const assistantId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const { output } = await generateAnswer(value);

      for await (const chunk of readStreamableValue(output)) {
        if (!chunk) continue;

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                content: "Une erreur est survenue pendant la génération.",
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatLayout
      title="Assistant RSC"
      subtitle="Server Actions + streaming"
      status={isLoading ? "Réponse en cours..." : "Prêt"}
      icon={Zap}
      iconClassName="bg-amber-500/10 text-amber-500 ring-amber-500/15"
      footer={
        <ChatComposer
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="Pose une question..."
          disabled={isLoading}
          isLoading={isLoading}
        />
      }
    >
      <ChatMessages
        messages={messages}
        scrollRef={scrollRef}
        isLoading={isLoading}
        emptyTitle="Interface RSC pour Server Actions"
        emptyDescription="Pose une question pour tester l’action serveur."
        userBubbleClassName="rounded-br-md border-amber-500/20 bg-amber-500 text-black"
      />
    </ChatLayout>
  );
}
