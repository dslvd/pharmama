"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import CurrentStocks from "./components/CurrentStocks";
import LowStocks from "./components/LowStocks";
import SalesCard from "./components/SalesCard";
import SalesOverview from "./components/SalesOverview";
import TransactionsCard from "./components/TransactionsCard";
import RecentTransactions from "./components/RecentTransactions";
import Loading from "@/app/(app)/dashboard/loading";
import { ErrorStack } from "@/components/ErrorCard";
import { Stock } from "@/lib/types/stock";
import { getStockList } from "@/lib/api/stocks";
import { Transaction } from "@/lib/types/transaction";
import { getTransactionList } from "@/lib/api/transaction";
import { useAuth } from "@/lib/auth";
import { UserRound } from "lucide-react";
import { formatLongDay } from "@/lib/utils/format";

export default function Dashboard() {
  const { enterStaffView } = useAuth();
  const [stock, setStock] = useState<Stock[] | null>(null);
  const [transaction, setTransaction] = useState<Transaction[] | null>(null);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState({
    stock: true,
    transaction: true,
  });

  const setLoadingFor = useCallback(
    (key: keyof typeof loading, isLoading: boolean) => {
      setLoading((prev) => ({ ...prev, [key]: isLoading }));
    },
    [],
  );

  const isLoading = Object.values(loading).some(Boolean);

  const addError = useCallback(
    (message: string) =>
      setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]),
    [],
  );

  useEffect(() => {
    async function getStock() {
      const result = await getStockList();
      if (result.ok) setStock(result.value);
      else addError(result.error);
      setLoadingFor("stock", false);
    }
    getStock();
  }, [addError, setLoadingFor]);

  useEffect(() => {
    async function getTransaction() {
      const result = await getTransactionList();
      if (result.ok) setTransaction(result.value);
      else addError(result.error);
      setLoadingFor("transaction", false);
    }
    getTransaction();
  }, [addError, setLoadingFor]);

  const dateString = useMemo(() => formatLongDay(new Date()), []);

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
            onClick={enterStaffView}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <UserRound className="h-4 w-4" />
            Pharmacist view
          </button>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SalesCard transactions={transaction} />
          <TransactionsCard transactions={transaction} />
          <CurrentStocks stocks={stock} />
          <LowStocks stock={stock} />
        </section>

        {/* Charts and Watchlist */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-full lg:col-span-2">
            <SalesOverview onError={addError} />
          </div>
          <div className="h-full">
            <LowStocks stock={stock} variant="watchlist" />
          </div>
        </section>

        {/* Recent Transactions */}
        <RecentTransactions transactions={transaction} />

        <ErrorStack errors={errors} />
      </main>
      {isLoading && (
        <div className="pointer-events-auto absolute inset-0 z-40 bg-background">
          <Loading />
        </div>
      )}
    </div>
  );
}
