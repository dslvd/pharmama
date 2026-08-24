'use client'

import { useState } from 'react'
import Header from '../Header'
import Navigation from './Navigation'

export default function Drawer({ children }: { children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Header 
        onDrawerClick={() => setIsOpen((prev) => !prev)} 
        onCloseDrawer={() => setIsOpen(false)} 
      />
      <div className="flex pt-16"> 
        <Navigation isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}