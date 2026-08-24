'use client'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HeaderProps {
  onDrawerClick: () => void
  onCloseDrawer?: () => void
}

//header-main
//image-logo
export default function Header({ onDrawerClick, onCloseDrawer }: HeaderProps) {
  const handleLogoClick = () => {
    if (onCloseDrawer) {
      onCloseDrawer()
    } else {
      onDrawerClick() 
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-primary flex items-center px-4 z-50 text-primary-foreground">
      <button
        className="p-2 mr-2 rounded hover:bg-primary/80 transition-colors"
        onClick={onDrawerClick}
        aria-label="Open drawer"
      >
        <Menu className="w-6 h-6" />
      </button>
      <Link 
        href="/dashboard" 
        onClick={handleLogoClick}
        className="flex items-center hover:opacity-90 transition-opacity"
      >
        <Image
          src="/logo/pharlogo.png"
          alt="PharMaMa"
          width={160}
          height={41}
          className="shrink-0"
          priority
        />
      </Link>
    </header>
  )
}