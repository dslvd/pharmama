import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { getSalesOverview } from "@/lib/api/sales";

export default function SalesCard({
  onError,
}: {
  onError?: (message: string) => void;
}) {
  const [sales, setSales] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSales() {
      const result = await getSalesOverview("Today");

      if (result.ok) {
        setSales(result.value);
      } else {
        onError?.(result.error);
      }
      setLoading(false);
    }
    loadSales();
  }, [onError]);

  const total = sales.reduce((sum, i) => sum + i.value, 0);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <Wallet className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Today&apos;s Sales</p>
      <p className="mt-3 flex items-center gap-2 text-3xl font-bold text-foreground">
        {loading ? "—" : `₱${total.toLocaleString()}`}
      </p>
    </article>
  );
}
