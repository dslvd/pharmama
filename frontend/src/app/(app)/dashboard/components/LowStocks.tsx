"use client";

import { getProductList } from "@/lib/api/product";
import { Stock } from "@/lib/types/stock";
import { Product } from "@/lib/types/product";
import { AlertTriangle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const LOW_STOCK_THRESHOLD = 20;

interface LowStocksProps {
  stock: Stock[] | null;
  variant?: "card" | "watchlist";
}

export default function LowStocks({ stock, variant = "card" }: LowStocksProps) {
  const [products, setProducts] = useState<Record<number, Product>>({});

  const lowStocks = useMemo(
    () => stock?.filter((s) => s.quantity <= LOW_STOCK_THRESHOLD),
    [stock],
  );

  useEffect(() => {
    if (variant !== "watchlist") return;

    let cancelled = false;

    async function load() {
      const productResult = await getProductList();
      if (productResult.ok && !cancelled) {
        const productMap: Record<number, Product> = {};
        productResult.value.forEach((product: Product) => {
          productMap[product.id] = product;
        });
        setProducts(productMap);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [variant]);

  if (variant === "watchlist") {
    return (
      <article className="flex h-105 flex-col overflow-hidden rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Low stock watchlist
          </h3>
        </div>
        <ul className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {lowStocks?.length === 0 ? (
            <li className="text-sm text-muted-foreground">No low stocks</li>
          ) : (
            lowStocks?.map((s) => {
              const product = products[s.productId];
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {product?.name || `Product #${s.productId}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Batch {s.batchNumber}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {s.quantity} left
                  </span>
                </li>
              );
            })
          )}
        </ul>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Low stock alerts</p>
      <p className="mt-3 text-3xl font-bold text-foreground">
        {lowStocks?.length}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        needs restock this week
      </p>
    </article>
  );
}
