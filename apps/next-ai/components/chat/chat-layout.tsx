"use client";

import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

type ChatLayoutProps = {
  title: string;
  subtitle: string;
  status: string;
  icon: LucideIcon;
  iconClassName: string;
  children: ReactNode;
  footer: ReactNode;
};

export function ChatLayout({
  title,
  subtitle,
  status,
  icon: Icon,
  iconClassName,
  children,
  footer,
}: ChatLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />

      <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-5xl">
        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border-border/60 bg-background/85 shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ${iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <CardTitle className="text-base font-semibold tracking-tight">
                    {title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
              </div>

              <div className="rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground">
                {status}
              </div>
            </div>
          </CardHeader>

          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

          <CardFooter className="border-t border-border/60 bg-background/90 p-4 backdrop-blur">
            {footer}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
