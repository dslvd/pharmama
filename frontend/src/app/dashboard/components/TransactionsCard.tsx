"use client";

import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { getTransactionList } from "@/lib/api/transaction";
import { Transaction } from "@/lib/types/transaction";

export default function TransactionsCard({
  onError,
}: {
  onError?: (message: string) => void;
}) {
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        // Get all transactions
        const allResult = await getTransactionList();
        if (allResult.ok) {
          const transactions = allResult.value;
          setTotal(transactions.length);
          
          // Count transactions that might need review (those not completed or refunded)
          const pendingCount = transactions.filter(
            (t: Transaction) => t.status !== "COMPLETED" && t.status !== "REFUNDED"
          ).length;
          setPending(pendingCount);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        onError?.(message);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [onError]);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <ArrowRightLeft className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Transactions</p>
      <p className="mt-3 text-3xl font-bold text-foreground">
        {loading ? "—" : total}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {pending} pending review
      </p>
    </article>
  );
}
