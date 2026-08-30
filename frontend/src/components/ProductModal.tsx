"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductList } from "@/lib/api/product";
import { Product } from "@/lib/types/product";

interface ProductModalProps {
  onSelect: (pr: Product) => void;
  onClose: () => void;
}

export default function ProductModal({ onSelect, onClose }: ProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const result = await getProductList();

      if (result.ok) {
        setProducts(result.value);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    loadProduct();
  }, []);

  const handleClick = (pr: Product) => {
    onSelect(pr);
    onClose();
  };

  const filteredProducts = products.filter((product) => {
    const searchValue = search.trim().toLowerCase();
    return (
      !searchValue ||
      product.name.toLowerCase().includes(searchValue) ||
      product.genericName.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="product-picker-title"
        className="flex max-h-[min(680px,calc(100vh-2rem))] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-[#fdf6ec] shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stock inventory
            </p>
            <h2 id="product-picker-title" className="mt-1 text-xl font-bold text-foreground">
              Select a product
            </h2>
            {/* Should like set the product locked when editing */}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product picker"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-border px-6 py-4">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product or generic name"
              autoFocus
              className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {loading && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Loading products...
            </p>
          )}
          {error && <p className="px-3 py-8 text-center text-sm text-rose-600">Error: {error}</p>}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {search ? "No products match your search." : "No products available."}
            </p>
          )}
          {!loading && !error && filteredProducts.length > 0 && (
            <div className="grid gap-1 sm:grid-cols-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleClick(product)}
                  className="rounded-lg px-3 py-3 text-left transition-colors hover:bg-violet-50 focus:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <span className="block text-sm font-semibold text-foreground">{product.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{product.genericName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
