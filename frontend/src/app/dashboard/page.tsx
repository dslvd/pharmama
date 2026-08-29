"use client";

import { useCallback, useState, useMemo } from "react";
import CurrentStocks from "./components/CurrentStocks";
import LowStocks from "./components/LowStocks";
import SalesCard from "./components/SalesCard";
import SalesOverview from "./components/SalesOverview";
import TransactionsCard from "./components/TransactionsCard";
import RecentTransactions from "./components/RecentTransactions";
import Loading from "@/app/dashboard/loading";
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

  // Get current date in format: "Thursday, August 27"
  const dateString = useMemo(() => {
    const today = new Date();
    const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
    const dayOfMonth = today.getDate();
    return `${dayFormatter.format(today)}, ${monthFormatter.format(today)} ${dayOfMonth}`;
  }, []);

  return (
    <div className="relative">
      <main className="flex min-h-screen flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Iloilo Branch · {dateString}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Pharmacist view
          </button>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SalesCard onError={addError} onLoadingChange={handleLoadingChange} />
          <TransactionsCard onError={addError} />
          <CurrentStocks onError={addError} />
          <LowStocks />
        </section>

        {/* Charts and Watchlist */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SalesOverview
              onError={addError}
              onLoadingChange={handleLoadingChange}
            />
          </div>
          <div>
            <LowStocks variant="watchlist" />
          </div>
        </section>

        {/* Recent Transactions */}
        <RecentTransactions onError={addError} />

        <ErrorStack errors={errors} />
      </main>
      {loadingCards > 0 && (
        <div className="pointer-events-auto fixed inset-0 z-40 bg-background">
          <Loading />
        </div>
      )}
    </div>
  );
}
