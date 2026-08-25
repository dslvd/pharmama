'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navigation from './Navigation'

export default function Drawer({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <Navigation isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="relative min-w-0 flex-1">
        <button
          className="fixed top-1/2 z-50 flex h-14 w-6 -translate-y-1/2 items-center justify-center bg-primary text-white shadow-md transition-all duration-200 focus:outline-none"
          style={{
            left: isOpen ? '14rem' : '0rem',
            borderTopRightRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
          }}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Collapse navigation drawer' : 'Open navigation drawer'}
          title={isOpen ? 'Collapse navigation drawer' : 'Open navigation drawer'}
        >
          <span className="pointer-events-none absolute -top-3 left-0 h-3 w-3 overflow-hidden">
            <span className="block h-full w-full rounded-bl-full bg-transparent shadow-[-3px_3px_0_3px_var(--tw-shadow-color,#1e1b4b)] shadow-primary" />
          </span>

          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}

          <span className="pointer-events-none absolute -bottom-3 left-0 h-3 w-3 overflow-hidden">
            <span className="block h-full w-full rounded-tl-full bg-transparent shadow-[-3px_-3px_0_3px_var(--tw-shadow-color,#1e1b4b)] shadow-primary" />
          </span>
        </button>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}