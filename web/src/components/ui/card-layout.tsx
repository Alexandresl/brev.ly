import * as React from "react"
import { Card } from "@/components/ui/card.tsx";

interface CardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function CardLayout({ children }: CardLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center">
      <div className="w-[580px] h-[296px]">
        <Card>
          {children}
        </Card>
      </div>
    </div>
  )
}
