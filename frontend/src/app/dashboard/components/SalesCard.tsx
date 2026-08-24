import { getTodaySales } from "@/lib/api/transaction";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

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
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <Wallet className="h-5 w-5" />
        </span>
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
