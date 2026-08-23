'use client'

// import { ErrorStack } from "@/components/ErrorCard"
import CurrentStocks from "./components/CurrentStocks"
import { IncomingStocks } from "./components/IncomingStocks"
import SalesCard from "./components/SalesCard"

interface DashboardProps {
  userRole: 'superuser' | 'clinic'
}

export default function Dashboard({ userRole }: DashboardProps) {
  return (
    <main className="space-y-6 p-5">
      <h2 className="text-5xl font-bold text-primary">Dashboard</h2>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesCard />

        <CurrentStocks />

        <IncomingStocks />
      </section>

      {/* HARDCODED FOR ERROR HANDLING
      <ErrorStack
        errors={[
        { id: '1', message: 'Network connection lost.' },
        { id: '2', message: 'Database query timed out.' },
        ]}
        /> 
        */}

      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Spaceeeee ano di butang ta</p>
      </div>
    </main>
  )
}

