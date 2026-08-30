"use client";

import { X } from "lucide-react";
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
        className="flex h-150 w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-[#fdf6ec] shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stock inventory
            </p>
            <h2 id="product-picker-title" className="mt-1 text-lg font-bold text-foreground">
              Select a product
            </h2>
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

        {/* Search */}
        <div className="border-b border-border px-6 py-4">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by product or generic name"
              autoFocus
              className="w-full rounded-md border border-border bg-white py-2 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>
        </div>

        {/* Product List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              Loading products...
            </p>
          )}
          {error && (
            <p className="px-6 py-8 text-center text-sm text-rose-600">
              Error: {error}
            </p>
          )}
          {!loading && !error && filteredProducts.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              {search ? "No products match your search." : "No products available."}
            </p>
          )}
          {!loading && !error && filteredProducts.length > 0 && (
            <ul className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleClick(product)}
                    className="w-full px-6 py-3 text-left transition-colors hover:bg-violet-50 focus:bg-violet-50 focus:outline-none active:bg-violet-100"
                  >
                    <span className="block text-sm font-semibold text-foreground">
                      {product.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {product.genericName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
