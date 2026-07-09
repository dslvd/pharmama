'use client'

import { useState } from 'react'
import Navigation from '../../Components/UI/Navigation'
import LoginPage from '../../Components/UI/Login_Page'
import Dashboard from '../../Components/UI/Dashboard'
import Stocks from '../../Components/UI/Stocks'
import Transactions from '../../Components/UI/Transactions'
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
    <div className="min-h-screen bg-[#F5F1E8]">
      <Navigation
        currentPage={currentPage}
        userRole={userRole}
        onLogout={handleLogout}
        onPageChange={setCurrentPage}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard userRole={userRole} />}
        {currentPage === 'stocks' && <Stocks userRole={userRole} />}
        {currentPage === 'transactions' && <Transactions userRole={userRole} />}
        {currentPage === 'logbook' && <LogBook userRole={userRole} />}
      </main>
    </div>
  )
}
