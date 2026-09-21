"use client";

import { Stock } from "@/lib/types/stock";
import { Package } from "lucide-react";

export default function CurrentStocks({ stocks }: { stocks: Stock[] | null }) {
  const totalItems =
    stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
  const skuCount = stocks?.length || 0;

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Package className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Current stock</p>
      <p className="mt-3 text-3xl font-bold text-foreground">
        {stocks === null ? "—" : totalItems}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        items across {skuCount} SKUs
      </p>
    </article>
  );
}
