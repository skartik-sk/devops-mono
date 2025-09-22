"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-4 py-3 text-base bg-card border-border focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  )
}
