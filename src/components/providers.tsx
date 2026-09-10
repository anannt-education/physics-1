"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { StudentProvider } from "@/hooks/use-student";
import { AppShell } from "@/components/layout/app-shell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <StudentProvider>
        <AppShell>{children}</AppShell>
        <Toaster />
      </StudentProvider>
    </TooltipProvider>
  );
}
