"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { getProductList } from "@/lib/api/product";
import { CATEGORIES, Category, Product } from "@/lib/types/product";
import { CreateTransactionItemPayload } from "@/lib/types/transaction";
import { getStockList } from "@/lib/api/stocks";
import { Stock } from "@/lib/types/stock";
import { peso } from "@/lib/utils/format";

export interface SubmittedItem {
  trItems: CreateTransactionItemPayload;
  product: Product;
}

interface ProductPickerProps {
  onAddItem: (item: SubmittedItem) => void;
  onError?: (message: string) => void;
  // items already in the cart, so their quantities aren't sold twice
  cartItems?: SubmittedItem[];
  // bump to reload stock (e.g. after a sale)
  refreshKey?: number;
}

const pillClass = (active: boolean) =>
  `rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-muted-foreground hover:bg-secondary"
  }`;

const isExpired = (s: Stock) => new Date(s.expiryDate).getTime() <= Date.now();

export default function ProductPicker({
  onAddItem,
  onError,
  cartItems = [],
  refreshKey,
}: ProductPickerProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [pendingQty, setPendingQty] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      const [stockResult, productResult] = await Promise.all([
        getStockList(),
        getProductList(),
      ]);

      if (stockResult.ok) {
        setStock(stockResult.value);
      } else {
        onError?.(stockResult.error);
      }

      if (productResult.ok) {
        setAllProducts(productResult.value);
      } else {
        onError?.(productResult.error);
      }

      setLoading(false);
    }

    loadItems();
  }, [refreshKey, onError]);

  const products = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesCategoryFilter = !category || product.category === category;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.genericName?.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategoryFilter && matchesSearch;
    });
  }, [allProducts, category, searchTerm]);

  const availableProducts = products.filter((product) =>
    stock.some(
      (s) => s.productId === product.id && s.quantity > 0 && !isExpired(s),
    ),
  );

  // quantity left in a batch after what's already in the cart
  function remainingInBatch(s: Stock): number {
    const inCart = cartItems
      .filter((item) => item.trItems.stockId === s.id)
      .reduce((sum, item) => sum + item.trItems.quantity, 0);
    return s.quantity - inCart;
  }

  const getQty = (id: number) => pendingQty[id] ?? 1;

  const adjustQty = (id: number, delta: number) => {
    setPendingQty((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const handleAdd = (product: Product) => {
    const qty = getQty(product.id);

    // sell from the earliest-expiring batches first, splitting across batches
    const batches = stock
      .filter((s) => s.productId === product.id && !isExpired(s))
      .sort(
        (a, b) =>
          new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
      );

    const allocations: SubmittedItem[] = [];
    let needed = qty;
    for (const batch of batches) {
      if (needed === 0) break;
      const take = Math.min(remainingInBatch(batch), needed);
      if (take <= 0) continue;
      allocations.push({
        trItems: { stockId: batch.id, quantity: take },
        product,
      });
      needed -= take;
    }

    if (needed > 0) {
      onError?.(
        `Not enough stock for ${product.name}: only ${qty - needed} left.`,
      );
      return;
    }

    allocations.forEach(onAddItem);
    setPendingQty((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-5">
      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(undefined)}
          className={pillClass(!category)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? undefined : c)}
            className={pillClass(category === c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : availableProducts.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No products available.
          </div>
        ) : (
          availableProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 last:border-b-0 hover:bg-background"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.category} &middot; {peso(product.price)}
                </p>
              </div>

              <div className="flex w-24 shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-card px-1.5 py-1">
                <button
                  onClick={() => adjustQty(product.id, -1)}
                  aria-label="Decrease quantity"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center text-xs font-semibold text-foreground">
                  {getQty(product.id)}
                </span>
                <button
                  onClick={() => adjustQty(product.id, 1)}
                  aria-label="Increase quantity"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                onClick={() => handleAdd(product)}
                className="w-16 shrink-0 rounded-full bg-primary px-4 py-1.5 text-center text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
