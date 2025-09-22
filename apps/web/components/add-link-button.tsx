'use client'

import { Button } from './ui/button'
import { Plus } from 'lucide-react'

interface AddLinkButtonProps {
  onClick: () => void
  className?: string
}

export function AddLinkButton({ onClick, className }: AddLinkButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={`fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-200 z-50 ${className}`}
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}