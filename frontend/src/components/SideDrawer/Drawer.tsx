'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navigation from './Navigation'

export default function Drawer({ children }: { children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <Navigation isOpen={isOpen} onClose={() => setIsOpen(false)}/>
      <div className="relative min-w-0 flex-1">
        <button
          className="fixed top-1/2 z-60 flex h-11 w-7 -translate-y-1/2 items-center justify-center rounded-r-md border border-primary/70 bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90"
          style={{ left: isOpen ? '13.75rem' : '0' }}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Collapse navigation drawer' : 'Open navigation drawer'}
          title={isOpen ? 'Collapse navigation drawer' : 'Open navigation drawer'}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}