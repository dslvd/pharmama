'use client'
import { Menu } from 'lucide-react'

interface HeaderProps {
  onDrawerClick: () => void
}

export default function Header({ onDrawerClick }: HeaderProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-end px-4">
      <button
        className="pointer-events-auto rounded-md bg-card p-2 text-foreground shadow-sm transition-colors hover:bg-muted"
        onClick={onDrawerClick}
        aria-label="Toggle navigation drawer"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  )
}