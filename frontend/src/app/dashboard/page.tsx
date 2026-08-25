"use client";

import { useCallback, useState } from "react";
import CurrentStocks from "./components/CurrentStocks";
import LowStocks from "./components/LowStocks";
import SalesCard from "./components/SalesCard";
import SalesOverview from "./components/SalesOverview";
import Loading from "./loading";
import { ErrorStack } from "@/components/ErrorCard";

export default function Dashboard() {
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loadingCards, setLoadingCards] = useState(2);

  const addError = useCallback(
    (message: string) =>
      setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]),
    [],
  );
  const handleLoadingChange = useCallback((loading: boolean) => {
    setLoadingCards((count) =>
      loading ? Math.max(count, 1) : Math.max(count - 1, 0),
    );
  }, []);

  return (
    <div className="relative">
      <main className="flex min-h-screen flex-col space-y-6 p-6">
        <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SalesCard onError={addError} onLoadingChange={handleLoadingChange} />
          <CurrentStocks />
          <LowStocks />
        </section>

        <SalesOverview onLoadingChange={handleLoadingChange} />
        <ErrorStack errors={errors} />
      </main>

      {loadingCards > 0 && (
        <div className="absolute inset-0 z-10 bg-background">
          <Loading />
        </div>
      )}
    </div>
  );
}
