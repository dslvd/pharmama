"use client";

import { useMemo } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Transaction } from "@/lib/types/transaction";

export default function TransactionsCard({
  transactions,
}: {
  transactions: Transaction[] | null;
}) {
  const cancelled = useMemo(
    () => transactions?.filter((t) => t.status === "CANCELLED").length ?? 0,
    [transactions],
  );

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <ArrowRightLeft className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Transactions</p>
      <p className="mt-3 text-3xl font-bold text-foreground">
        {transactions === null ? "—" : transactions.length}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {cancelled} cancelled
      </p>
    </article>
  );
}
