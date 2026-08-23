import { useState, useEffect } from "react";
import { getStockList } from "@/lib/api/stocks";

export function IncomingStocks() {
  const [stocks, setStocks] = useState<{ total: number; pending: number } | null>(
    null,
  );

  useEffect(() => {
    async function loadStocks() {
      const result = await getStockList();

      if (result.ok) {
        setStocks({ total: result.value.length, pending: 0 });
      } else {
        console.log(result.error);
      }
    }
    loadStocks();
  }, []);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">Incoming Stocks</p>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{stocks?.total ?? "—"}</span>
          <span className="flex-1 border-b border-dotted border-muted-foreground/40" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{stocks?.pending ?? "—"}</span>
          <span className="flex-1 border-b border-dotted border-muted-foreground/40" />
        </div>
      </div>
    </article>
  );
}