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
        className={`sticky top-0 z-50 flex h-screen shrink-0 flex-col justify-between overflow-hidden bg-primary transition-all duration-200
          ${isOpen ? 'w-56' : 'w-0'}`}
        aria-label="Main Navigation"
      >
        <div className="px-2 pt-6">
          <Link href="/dashboard" onClick={onClose} className="mb-8 flex items-center px-2">
            <Image
              src="/logo/pharlogo.png"
              alt="PharMaMa"
              width={160}
              height={41}
              className="shrink-0"
              priority
            />
          </Link>

          <nav className="flex flex-col gap-1">
            <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-violet-300">Overview</p>
            {navItems.slice(0, 1).map(({ label, page, icon: Icon }) => {
            const isActive = pathname === page || pathname.startsWith(`${page}/`)

            return (
              <Link
                key={page}
                href={page}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-violet-600 font-semibold text-white'
                    : 'text-violet-100 hover:bg-violet-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            )
            })}

            <p className="px-3 pb-2 pt-6 text-[11px] font-medium uppercase tracking-wider text-violet-300">Inventory</p>
            {navItems.slice(1, 3).map(({ label, page, icon: Icon }) => {
              const isActive = pathname === page || pathname.startsWith(`${page}/`)

              return (
                <Link
                  key={page}
                  href={page}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive ? 'bg-violet-600 font-semibold text-white' : 'text-violet-100 hover:bg-violet-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              )
            })}

            <p className="px-3 pb-2 pt-6 text-[11px] font-medium uppercase tracking-wider text-violet-300">Records</p>
            {navItems.slice(3).map(({ label, page, icon: Icon }) => {
              const isActive = pathname === page || pathname.startsWith(`${page}/`)

              return (
                <Link
                  key={page}
                  href={page}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive ? 'bg-violet-600 font-semibold text-white' : 'text-violet-100 hover:bg-violet-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="mx-2 border-t border-violet-900 p-3">
          <div className="flex items-center gap-3">
            <Image
              src="/image/jeremy.png"
              alt="Jeremy"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold text-white">Jeremy Giyangan</p>
              <p className="text-xs font-semibold text-violet-300">Pharmacist · Iloilo Branch</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}