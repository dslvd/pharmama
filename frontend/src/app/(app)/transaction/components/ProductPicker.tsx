"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { getProductList } from "@/lib/api/product";
import { CATEGORIES, Category, Product } from "@/lib/types/product";
import { CreateTransactionItemPayload } from "@/lib/types/transaction";
import { getStockList } from "@/lib/api/stocks";
import { Stock } from "@/lib/types/stock";
import { peso, titleCase } from "@/lib/utils/format";
import { Badge } from "@/components/ui/table";

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

const REASON_STYLES: Record<string, string> = {
  Expired: "bg-danger-soft text-danger",
  "Out of stock": "bg-muted/60 text-muted-foreground",
  "All in cart": "bg-info-soft text-info",
};

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
  // typed quantities per product, kept as text so the field can be empty
  const [pendingQty, setPendingQty] = useState<Record<number, string>>({});
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

  // quantity left in a batch after what's already in the cart
  function remainingInBatch(s: Stock): number {
    const inCart = cartItems
      .filter((item) => item.trItems.stockId === s.id)
      .reduce((sum, item) => sum + item.trItems.quantity, 0);
    return s.quantity - inCart;
  }

  // sellable units left for a product: unexpired batches minus the cart
  const availableFor = (productId: number) =>
    stock
      .filter((s) => s.productId === productId && !isExpired(s))
      .reduce((sum, s) => sum + Math.max(0, remainingInBatch(s)), 0);

  // at least 1; the +/- buttons also stop at what's available
  const atLeastOne = (value: string | number) =>
    Math.max(1, Number(value) || 1);

  const getQty = (id: number) => pendingQty[id] ?? "1";

  const setQty = (id: number, value: string) =>
    setPendingQty((prev) => ({ ...prev, [id]: value }));

  const adjustQty = (id: number, delta: number) =>
    setQty(
      id,
      String(
        Math.min(
          atLeastOne(Number(getQty(id)) + delta),
          Math.max(1, availableFor(id)),
        ),
      ),
    );

  const handleAdd = (product: Product) => {
    // typing more than what's left is reported by the allocation below
    const qty = atLeastOne(getQty(product.id));

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
    setQty(product.id, "1");
  };

  // why a product can't be sold right now, or null if it can. Unsellable
  // products stay listed (greyed out) so it's clear why they can't be added.
  const unavailableReason = (productId: number): string | null => {
    const batches = stock.filter(
      (s) => s.productId === productId && s.quantity > 0,
    );
    if (!batches.some((s) => !isExpired(s))) {
      return batches.length > 0 ? "Expired" : "Out of stock";
    }
    return availableFor(productId) === 0 ? "All in cart" : null;
  };

  // sellable products first, keeping the catalog order within each group
  const listed = products
    .map((product) => ({ product, reason: unavailableReason(product.id) }))
    .sort((a, b) => Number(!!a.reason) - Number(!!b.reason));

  return (
    // same height as the cart (TransactionTable) so the two cards line up
    <div className="flex h-[520px] flex-col rounded-2xl border border-border bg-background p-4 sm:h-[560px] sm:p-5 lg:h-[620px]">
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

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : listed.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No products found.
          </div>
        ) : (
          listed.map(({ product, reason }) => (
            <div
              key={product.id}
              className={`flex min-h-16 items-center justify-between gap-3 border-b border-border/60 px-4 py-3 last:border-b-0 ${
                reason ? "bg-muted/15" : "hover:bg-background"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-semibold ${
                    reason ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {titleCase(product.category)} &middot; {peso(product.price)}
                  {!reason && (
                    <> &middot; {availableFor(product.id)} available</>
                  )}
                </p>
              </div>

              {reason ? (
                <Badge className={REASON_STYLES[reason]}>{reason}</Badge>
              ) : (
                <>

                  <div className="flex w-28 shrink-0 items-center justify-center gap-1 rounded-full border border-border bg-card px-1.5 py-1">
                    <button
                      onClick={() => adjustQty(product.id, -1)}
                      aria-label="Decrease quantity"
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                    >
                      <Minus size={12} />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      aria-label={`Quantity of ${product.name}`}
                      value={getQty(product.id)}
                      onChange={(e) =>
                        setQty(product.id, e.target.value.replace(/\D/g, ""))
                      }
                      onBlur={(e) =>
                        setQty(product.id, String(atLeastOne(e.target.value)))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd(product);
                      }}
                      className="w-10 rounded bg-transparent text-center text-xs font-semibold text-foreground tabular-nums focus:bg-background focus:outline-none"
                    />
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
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
