"use client";

import { LOW_STOCK_THRESHOLD, Stock } from "@/lib/types/stock";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";

interface LowStocksProps {
  stock: Stock[] | null;
  variant?: "card" | "watchlist";
}

export default function LowStocks({ stock, variant = "card" }: LowStocksProps) {
  const lowStocks = useMemo(
    () => stock?.filter((s) => s.quantity <= LOW_STOCK_THRESHOLD),
    [stock],
  );

  if (variant === "watchlist") {
    return (
      <article className="flex h-105 flex-col overflow-hidden rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-soft text-warning">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Low stock watchlist
          </h3>
        </div>
        <ul className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {lowStocks?.length === 0 ? (
            <li className="text-sm text-muted-foreground">No low stocks</li>
          ) : (
            lowStocks?.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {s.product?.name ?? `Product #${s.productId}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Batch {s.batchNumber}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-semibold text-warning">
                  {s.quantity} left
                </span>
              </li>
            ))
          )}
        </ul>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-soft text-warning">
          <AlertTriangle className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Low stock alerts</p>
      <p className="mt-3 text-3xl font-bold text-foreground">
        {stock === null ? "—" : lowStocks?.length}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        batches at or below {LOW_STOCK_THRESHOLD} units
      </p>
    </article>
  );
}
