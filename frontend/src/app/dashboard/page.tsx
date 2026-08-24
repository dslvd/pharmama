"use client";

import { useState } from "react";
import CurrentStocks from "./components/CurrentStocks";
import LowStocks from "./components/LowStocks";
import SalesCard from "./components/SalesCard";
import SalesOverview from "./components/SalesOverview";
import { ErrorStack } from "@/components/ErrorCard";

export default function Dashboard() {
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);
  return (
    <main className="space-y-6 p-6">
      <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SalesCard onError={addError} />
        <CurrentStocks />
        <LowStocks />
      </section>

      <SalesOverview />
      <ErrorStack errors={errors} />
    </main>
  );
}
