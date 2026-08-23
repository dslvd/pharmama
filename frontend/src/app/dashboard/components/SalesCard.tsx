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
    <article className="bg-card rounded-lg border border-border p-6">
      <p className="text-muted-foreground text-sm">Today&apos;s Sales</p>
      <p className="text-4xl font-bold text-primary mt-2">
        {sales?.total.toLocaleString()}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sales?.date}</p>
    </article>
  );
}