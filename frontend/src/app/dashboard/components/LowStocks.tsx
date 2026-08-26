"use client";

import { getStockList } from "@/lib/api/stocks";
import { Stock } from "@/lib/types/stock";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const LOW_STOCK_THRESHOLD = 10;

export default function LowStocks() {
  const [stocks, setStocks] = useState<Stock[] | null>(null);

  useEffect(() => {
    async function loadStocks() {
      const result = await getStockList();

      if (result.ok) {
        setStocks(result.value.filter((stock) => stock.quantity <= LOW_STOCK_THRESHOLD));
      } else {
        setStocks([]);
      }
    }

    loadStocks();
  }, []);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Low Stocks</p>
          <p className="text-2xl font-bold text-foreground">
            {stocks === null ? "—" : stocks.length}
          </p>
        </div>
      </div>
      <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
        {stocks === null ? (
          <li className="text-sm text-muted-foreground">Loading stocks...</li>
        ) : stocks.length === 0 ? (
          <li className="text-sm text-muted-foreground">No low stocks</li>
        ) : (
          stocks.map((stock) => (
            <li
              key={stock.id}
              className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm last:border-0 last:pb-0"
            >
              <span className="min-w-0 truncate text-foreground">
                Product #{stock.productId}
                <span className="block truncate text-xs text-muted-foreground">
                  Batch {stock.batchNumber}
                </span>
              </span>
              <span className="shrink-0 font-semibold text-amber-600">
                {stock.quantity} left
              </span>
            </li>
          ))
        )}
      </ul>
    </article>
  );
}
