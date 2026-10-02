'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Navigation from './Navigation'

export default function Drawer({ children }: { children: React.ReactNode }) {
  // overlay menu: closed by default so the page gets the full width
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Esc or a click anywhere outside the menu closes it (no backdrop, so
  // the click still reaches whatever was clicked)
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    const onPointer = (e: PointerEvent) => {
      if (!(e.target as Element).closest('[data-drawer]')) setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [isOpen])

  // login page renders without the app shell
  if (pathname.startsWith('/auth')) return <>{children}</>

  return (
    <div className="min-h-screen">
      <Navigation isOpen={isOpen} onNavigate={() => setIsOpen(false)} />

      <div className="relative min-w-0">
        <button
          data-drawer
          className="fixed top-1/2 z-50 flex h-14 w-6 -translate-y-1/2 items-center justify-center bg-primary text-primary-foreground shadow-md transition-all duration-200"
          style={{
            left: isOpen ? '14rem' : '0rem',
            borderTopRightRadius: '0.75rem',
            borderBottomRightRadius: '0.75rem',
          }}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          title={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className="pointer-events-none absolute -top-3 left-0 h-3 w-3 overflow-hidden">
            <span className="block h-full w-full rounded-bl-full bg-transparent shadow-[-3px_3px_0_3px_var(--tw-shadow-color,var(--primary))] shadow-primary" />
          </span>

          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}

          <span className="pointer-events-none absolute -bottom-3 left-0 h-3 w-3 overflow-hidden">
            <span className="block h-full w-full rounded-tl-full bg-transparent shadow-[-3px_-3px_0_3px_var(--tw-shadow-color,var(--primary))] shadow-primary" />
          </span>
        </button>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}