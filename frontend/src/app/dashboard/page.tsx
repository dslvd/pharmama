'use client'

import CurrentStocks from "./components/CurrentStocks"
import { IncomingStocks } from "./components/IncomingStocks"
import SalesCard from "./components/SalesCard"
import StocksTable from "./components/Stockstable"
import TransactionPanel from "./components/Transactionpanel"

interface DashboardProps {
  userRole: 'superuser' | 'clinic'
}

export default function Dashboard({ userRole }: DashboardProps) {
  return (
    <main className="space-y-6 p-6">
      <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SalesCard />
        <CurrentStocks />
        <IncomingStocks />
      </section>

      <StocksTable />

      <TransactionPanel />
    </main>
  )
}