import { getTodaySales } from "@/lib/api/transaction";
import { useEffect, useState } from "react";

export default function SalesCard() {
  const [sales, setSales] = useState<{ total: number; date: string } | null>(
    null,
  );

  useEffect(() => {
    async function loadSales() {
      const result = await getTodaySales();

      if (result.ok) {
        setSales(result.value);
      } else {
        console.log(result.error);
      }
    }
    loadSales();
  }, []);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">Today&apos;s Sales</p>
        <p className="text-xs text-muted-foreground">{sales?.date ?? "—"}</p>
      </div>
      <p className="mt-3 flex items-center gap-2 text-3xl font-bold text-foreground">
        <span className="text-2xl">
          {sales ? " " + sales.total.toLocaleString() : "—"}
        </span>
      </p>
    </article>
  );
}
