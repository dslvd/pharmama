'use client'

import { useState } from 'react'

interface NavigationProps {
  currentPage: string
  userRole: 'superuser' | 'clinic'
  onLogout: () => void
  onPageChange?: (page: string) => void
}

export default function Navigation({ currentPage, userRole, onLogout, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Transactions', page: 'transactions' },
    { label: 'Stocks', page: 'stocks' },
    { label: 'Log Book', page: 'logbook' },
  ]

  return (
    <nav className="bg-[#2D1B4E] text-[#F5F1E8] shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#C84B8A] rounded-lg flex items-center justify-center font-bold text-sm">
              Rx
            </div>
            <h1 className="text-lg font-bold hidden sm:block">PharmaMa</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.page
              return (
                <button
                  key={item.page}
                  onClick={() => onPageChange?.(item.page)}
                  className={`px-4 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-[#C84B8A] text-white'
                      : 'hover:bg-[#4A3A6B] text-[#D4C8B8]'
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
              <div className="w-8 h-8 bg-[#C84B8A] rounded-full flex items-center justify-center">
                <span>N</span>
              </div>
              <div>
                <p className="font-semibold">User</p>
                <p className="text-xs text-[#D4C8B8]">Admin</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
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
              const isActive = currentPage === item.page
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onPageChange?.(item.page)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-[#C84B8A] text-white'
                      : 'hover:bg-[#4A3A6B] text-[#D4C8B8]'
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
