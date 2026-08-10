'use client'

import { on } from 'events'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

interface NavigationProps {
  onPageChange?: (page: string) => void
}

export default function Navigation({  onPageChange }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', page: '/dashboard' },
    { label: 'Transactions', page: '/transactions' },
    { label: 'Stocks', page: '/stocks' },
    { label: 'Log Book', page: '/logbook' },
  ]

  const handlePageChange = (page: string) => {
      if (pathname === page) {return}
      router.push(page)
      onPageChange?.(page)
  }

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-sm">
              Rx
            </div>
            <h1 className="text-lg font-bold hidden sm:block">PharmaMa</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.page
              return (
                <button
                  key={item.page}
                  onClick={() => handlePageChange(item.page)}
                  className={`px-4 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-accent text-primary-foreground'
                      : 'hover:bg-primary/80 text-secondary cursor-pointer'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span>N</span>
              </div>
              <div>
                <p className="font-semibold">User</p>
                <p className="text-xs text-secondary">Admin</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.page
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onPageChange?.(item.page)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-accent text-primary-foreground'
                      : 'hover:bg-primary/80 text-secondary'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
