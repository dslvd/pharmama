"use client";

import CurrentStocks from "./components/CurrentStocks";
import LowStocks from "./components/LowStocks";
import SalesCard from "./components/SalesCard";
import SalesOverview from "./components/SalesOverview";

export default function Dashboard() {
  return (
    <main className="space-y-6 p-6">
      <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SalesCard />
        <CurrentStocks />
        <LowStocks />
      </section>

      <SalesOverview />
    </main>
  );
}
