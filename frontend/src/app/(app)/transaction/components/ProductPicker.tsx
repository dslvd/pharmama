"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Search } from "lucide-react";
import { getProductList } from "@/lib/api/product";
import { Category, Product } from "@/lib/types/product";
import { CreateTransactionItemPayload } from "@/lib/types/transaction";
import { getStockList } from "@/lib/api/stocks";
import { Stock } from "@/lib/types/stock";

const CATEGORY_VALUES: Category[] = [
  "ANALGESICS",
  "ANTIBIOTICS",
  "ANTIHISTAMINES",
  "VITAMINS",
  "SUPPLEMENTS",
  "ANTACIDS",
  "HYGIENE",
  "OTHERS",
];

export interface SubmittedItem {
  trItems: CreateTransactionItemPayload;
  product: Product;
}

interface ProductPickerProps {
  onAddItem: (item: SubmittedItem) => void;
  onError?: (message: string) => void;
}

export default function ProductPicker({
  onAddItem,
  onError,
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
        getStockList({}),
        getProductList({}),
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
  }, []);

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
    stock.some((s) => s.productId === product.id && s.quantity > 0),
  );

  function findStockId(productId: number): number | undefined {
    return stock.find((s) => s.productId === productId)?.id;
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
    onAddItem({
      trItems: {
        quantity: qty,
        productId: product.id,
        stockId: findStockId(product.id) ?? 0,
        unitPrice: product.price,
      },
      product,
    });
    setPendingQty((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#e4dccf] bg-[#f5f1e8] p-5">
      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c93b0]"
        />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="w-full rounded-full border border-[#e4dccf] bg-white py-2 pl-9 pr-4 text-sm text-[#1e1b3a] placeholder:text-[#9c93b0] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(undefined)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            !category
              ? "border-violet-950 bg-violet-950 text-white"
              : "border-[#d8cfbf] bg-white text-[#4b4468] hover:bg-[#efe9db]"
          }`}
        >
          All
        </button>
        {CATEGORY_VALUES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? undefined : c)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              category === c
                ? "border-violet-950 bg-violet-950 text-white"
                : "border-[#d8cfbf] bg-white text-[#4b4468] hover:bg-[#efe9db]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-[#e4dccf] bg-white">
        {loading ? (
          <div className="p-4 text-center text-sm text-[#6f6787]">
            Loading products...
          </div>
        ) : availableProducts.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#6f6787]">
            No products available.
          </div>
        ) : (
          availableProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 border-b border-[#f0ece0] px-4 py-3 last:border-b-0 hover:bg-[#faf7f0]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1e1b3a]">
                  {product.name}
                </p>
                <p className="text-xs text-[#9c93b0]">
                  {product.category} &middot; ₱{" "}
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="flex w-24 shrink-0 items-center justify-center gap-1 rounded-full border border-[#d8cfbf] bg-white px-1.5 py-1">
                <button
                  onClick={() => adjustQty(product.id, -1)}
                  aria-label="Decrease quantity"
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[#6f6787] hover:bg-[#efe9db]"
                >
                  <Minus size={12} />
                </button>
                <span className="w-5 text-center text-xs font-semibold text-[#1e1b3a]">
                  {getQty(product.id)}
                </span>
                <button
                  onClick={() => adjustQty(product.id, 1)}
                  aria-label="Increase quantity"
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[#6f6787] hover:bg-[#efe9db]"
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                onClick={() => handleAdd(product)}
                className="w-16 shrink-0 rounded-full bg-violet-950 px-4 py-1.5 text-center text-xs font-semibold text-white transition-colors hover:bg-violet-900"
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
