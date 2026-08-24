'use client'

import { usePathname } from 'next/navigation'
import { PanelsTopLeft, ArrowLeftRight, Package, FolderBookmark, X} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Dashboard', page: '/dashboard', icon: PanelsTopLeft },
  { label: 'Transaction', page: '/transaction', icon: ArrowLeftRight },
  { label: 'Stocks', page: '/stocks', icon: Package },
  { label: 'Log Book', page: '/logbook', icon: FolderBookmark },
 ]

export default function Navigation ({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname()

  return (
    <>
<aside
        className={`sticky top-0 z-50 h-[calc(100vh-4rem)] bg-white transition-all duration-200 overflow-hidden flex flex-col justify-between
          ${isOpen ? 'w-64' : 'w-0'}`}
        aria-label="Main Navigation"
      >
        <div>
        <div className="flex justify-end p-3">
          <button 
            onClick={onClose} 
            aria-label="Close menu"
            className="p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map(({ label, page, icon: Icon }) => {
            const isActive = pathname === page || pathname.startsWith(`${page}/`)

            return (
              <Link
                key={page}
                href={page}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-left transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-slate-700 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
        </div>

        <div className="border-t p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/image/jeremy.png"
              alt="Jeremy"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="font-bold text-sm text-slate-900">Jeremy Giyangan</p>
              <p className="font-semibold text-xs text-slate-500 italic ">Intruder</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}