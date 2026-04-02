"use client";

import { FormEvent } from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  placeholder: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled = false,
  isLoading = false,
}: ChatComposerProps) {
  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-3xl gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="h-12 rounded-2xl border-border/60 bg-background shadow-sm"
      />
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        size="icon"
        className="h-12 w-12 rounded-2xl shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
