'use client'

import CurrentStocks from "./components/CurrentStocks"
import { IncomingStocks } from "./components/IncomingStocks"
import SalesCard from "./components/SalesCard"
import StocksTable from "./components/StocksTable"
import TransactionSection from "@/app/dashboard/components/TransactionSection"

interface DashboardProps {
  userRole: 'superuser' | 'clinic'
}

export default function Dashboard({ userRole }: DashboardProps) {
  return (
    <main className="space-y-6 p-5">
      <div>
        <h2 className="text-4xl font-bold text-primary">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Not Final Idk what to design here anymore
        </p>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesCard />

        <CurrentStocks />

        <IncomingStocks />
      </section>

      <StocksTable />

      <TransactionSection />
    </main>
  )
}