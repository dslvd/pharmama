'use client'

import SalesCard from "./components/SalesCard"

interface DashboardProps {
  userRole: 'superuser' | 'clinic'
}

export default function Dashboard({ userRole }: DashboardProps) {
  return (
    <main className="space-y-6">
      <h2 className="text-5xl font-bold text-primary">Dashboard</h2>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SalesCard />

        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm">Current Stocks</p>
          <p className="text-4xl font-bold text-primary mt-2">—</p>
        </div>

        <article className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm">Incoming Stocks</p>
          <div className="mt-2">
            <p className="text-2xl font-bold text-primary">9</p>
            <p className="text-2xl font-bold text-primary">4</p>
          </div>
        </article>
      </section>

      <div className="bg-card rounded-lg border border-border p-6">
        <p className="text-muted-foreground">Spaceeeee ano di butang ta</p>
      </div>
    </main>
  )
}
