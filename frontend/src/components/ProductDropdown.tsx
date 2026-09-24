"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "cn";
import Dropdown from "@/components/ui/Dropdown";
import { getProductList } from "@/lib/api/product";
import { Product } from "@/lib/types/product";

interface ProductDropdownProps {
  value: Product | null;
  onChange: (product: Product) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error?: string;
}

export default function ProductDropdown({
  value,
  onChange,
  open,
  onOpenChange,
  error,
}: ProductDropdownProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    async function loadProducts() {
      setLoading(true);
      const result = await getProductList();
      if (cancelled) return;

      if (result.ok) {
        setProducts(result.value);
      } else {
        setLoadError(result.error);
      }
      setLoading(false);
    }
    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const filteredProducts = products.filter((product) => {
    const searchValue = search.trim().toLowerCase();
    return (
      !searchValue ||
      product.name.toLowerCase().includes(searchValue) ||
      product.genericName.toLowerCase().includes(searchValue)
    );
  });

  return (
    <Dropdown
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-border bg-input px-3 py-2.5 text-left text-sm text-foreground outline-none transition-colors duration-200 hover:border-ring focus:border-ring focus:ring-2 focus:ring-ring/20",
            error && "border-destructive",
          )}
        >
          <span className={value ? "text-foreground" : "text-muted-foreground"}>
            {value ? value.name : "Select a product"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      }
    >
      <div className="flex max-h-80 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product or generic name"
            autoFocus
            className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Loading products...
            </p>
          )}
          {loadError && (
            <p className="px-4 py-6 text-center text-sm text-destructive">
              Error: {loadError}
            </p>
          )}
          {!loading && !loadError && filteredProducts.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {search ? "No products match your search." : "No products available."}
            </p>
          )}
          {!loading && !loadError && filteredProducts.length > 0 && (
            <ul className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(product);
                      onOpenChange(false);
                    }}
                    className="w-full px-4 py-2.5 text-left transition-colors hover:bg-background focus:bg-background focus:outline-none"
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
      </div>
    </Dropdown>
  );
}
