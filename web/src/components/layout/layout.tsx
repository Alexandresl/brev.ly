import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner.tsx";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="flex-1 min-h-0 w-full bg-gray-200 dark:bg-gray-600 overflow-y-auto overflow-x-hidden">
      <div className="container mx-auto max-w-300 h-full px-4 py-8">
        {children}
      </div>
      <Toaster richColors position="top-right" />
    </main>
  );
}
