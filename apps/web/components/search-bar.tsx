'use client'

import { useState, useEffect } from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search links...",
  debounceMs = 300
}: SearchBarProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(displayValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [displayValue, onChange, debounceMs])

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value)}
        className="pl-10 pr-4 w-full"
      />
    </div>
  )
}