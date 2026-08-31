import { useEffect, useState } from "react";
import { Wallet, TrendingUp } from "lucide-react";
import { getSalesOverview } from "@/lib/api/sales";

export default function SalesCard({
  onError,
  onLoadingChange,
}: {
  onError?: (message: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [sales, setSales] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    onLoadingChange?.(true);

    async function loadSales() {
      const result = await getSalesOverview("Today");

      if (result.ok) {
        setSales(result.value);
        setPercentageChange(12);
      } else {
        onError?.(result.error);
      }
      setLoading(false);
      onLoadingChange?.(false);
    }
    loadSales();
  }, [onError, onLoadingChange]);

  const total = sales.reduce((sum, i) => sum + i.value, 0);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <Wallet className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Today&apos;s sales</p>
      <p className="mt-3 flex items-center gap-2 text-3xl font-bold text-foreground">
        {loading
          ? "—"
          : `₱ ${total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
      </p>
      <div className="mt-2 flex items-center gap-1">
        <TrendingUp className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-medium text-emerald-600">
          {percentageChange}% vs. yesterday
        </span>
      </div>
    </article>
  );
}
