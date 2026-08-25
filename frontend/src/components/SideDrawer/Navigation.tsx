'use client'

import { usePathname } from 'next/navigation'
import { PanelsTopLeft, ArrowLeftRight, Package, FolderBookmark, ClipboardList } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { label: 'Dashboard', page: '/dashboard', icon: PanelsTopLeft },
  { label: 'Stocks', page: '/stocks', icon: Package },
  { label: 'Products', page: '/products', icon: ClipboardList },
  { label: 'Transactions', page: '/transaction', icon: ArrowLeftRight },
  { label: 'Logbook', page: '/logbook', icon: FolderBookmark },
]

export default function Navigation ({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className={`sticky top-0 z-50 flex h-screen shrink-0 flex-col justify-between overflow-hidden bg-primary transition-all duration-200 ${
          isOpen ? 'w-56' : 'w-0'
        }`}
        aria-label="Main Navigation"
      >
        <div className="flex flex-col px-4 pt-6">
          <Link href="/dashboard" onClick={onClose} className="mb-10 flex items-center px-1">
            <Image src="/logo/pharlogo.png" alt="PharMaMa" width={160} height={41} className="shrink-0" priority />
          </Link>

          <nav className="flex flex-col gap-1">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300/70">Overview</p>
            {navItems.slice(0, 1).map(({ label, page, icon: Icon }) => {
              const isActive = pathname === page || pathname.startsWith(`${page}/`)

              return (
                <Link
                  key={page}
                  href={page}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-violet-900 font-semibold text-white'
                      : 'text-violet-100/80 hover:bg-violet-900/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              )
            })}

            <p className="px-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-violet-300/70">Inventory</p>
            {navItems.slice(1, 3).map(({ label, page, icon: Icon }) => {
              const isActive = pathname === page || pathname.startsWith(`${page}/`)

              return (
                <Link
                  key={page}
                  href={page}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-violet-900 font-semibold text-white'
                      : 'text-violet-100/80 hover:bg-violet-900/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              )
            })}

            <p className="px-1 pt-5 text-[11px] font-semibold uppercase tracking-wider text-violet-300/70">Records</p>
            {navItems.slice(3).map(({ label, page, icon: Icon }) => {
              const isActive = pathname === page || pathname.startsWith(`${page}/`)

              return (
                <Link
                  key={page}
                  href={page}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-violet-900 font-semibold text-white'
                      : 'text-violet-100/80 hover:bg-violet-900/50 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-violet-900/60 p-4">
          <div className="flex items-center gap-3 px-1">
            <Image
              src="/image/jeremy.png"
              alt="Jeremy"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">Jeremy Giyangan</p>
              <p className="truncate text-[11px] text-violet-300/80">Pharmacist · Iloilo Branch</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}