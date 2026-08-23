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
    <article className="bg-card rounded-lg border border-border p-6">
      <p className="text-muted-foreground text-sm">Incoming Stocks</p>
      <div className="mt-2">
        <p className="text-2xl font-bold text-primary">{stocks?.total}</p>
        <p className="text-2xl font-bold text-primary">{stocks?.pending}</p>
      </div>
    </article>
  );
}