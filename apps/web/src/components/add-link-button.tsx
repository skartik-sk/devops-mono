"use client"

import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"

interface AddLinkButtonProps {
  onClick: () => void
}

export function AddLinkButton({ onClick }: AddLinkButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-xl transition-all duration-200"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}
