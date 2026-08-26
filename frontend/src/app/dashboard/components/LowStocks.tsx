import { AlertTriangle } from "lucide-react";

export default function LowStocks() {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm text-muted-foreground">Low Stocks</p>
      <p className="mt-1 text-3xl font-bold text-foreground">—</p>
    </article>
  );
}
