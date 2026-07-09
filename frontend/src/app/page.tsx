'use client'

import { useState } from 'react'
import Navigation from './Navigation/Page'
import LoginPage from './Login_page/page'
import Dashboard from '../../Components/UI/Dashboard'
import Stocks from './Stocks/page'
import Transactions from './Transactions/Page'
import LogBook from '../../Components/UI/Logbook'

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'superuser' | 'clinic'>('superuser')
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogin = (role: 'superuser' | 'clinic') => {
    setUserRole(role)
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={currentPage}
        userRole={userRole}
        onLogout={handleLogout}
        onPageChange={setCurrentPage}
      /> //salin moni sa layout.tsx
      

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard userRole={userRole} />}
        {currentPage === 'stocks' && <Stocks userRole={userRole} />}
        {currentPage === 'transactions' && <Transactions userRole={userRole} />}
        {currentPage === 'logbook' && <LogBook userRole={userRole} />}
      </main>
    </div>
  )
}
