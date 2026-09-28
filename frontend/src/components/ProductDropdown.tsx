"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "cn";
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
  const { contains } = Combobox.useFilter();

  useEffect(() => {
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
  }, []);

  return (
    <Combobox.Root
      items={products}
      value={value}
      onValueChange={(product: Product | null) => {
        if (product) onChange(product);
      }}
      open={open}
      onOpenChange={onOpenChange}
      itemToStringLabel={(product: Product) => product.name}
      isItemEqualToValue={(item: Product, selected: Product) =>
        item.id === selected.id
      }
      filter={(product: Product, query: string) =>
        contains(product.name, query) ||
        contains(product.genericName ?? "", query)
      }
    >
      <Combobox.InputGroup
        className={cn(
          "relative flex w-full items-center rounded-md border border-border bg-input transition-colors duration-200 hover:border-ring focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
          error && "border-destructive",
        )}
      >
        <Combobox.Input
          placeholder="Select a product"
          className="w-full bg-transparent py-2.5 pl-3 pr-9 text-sm font-normal text-foreground outline-none placeholder:text-muted-foreground"
        />
        <Combobox.Trigger
          aria-label="Open product list"
          className="absolute right-0 flex h-full w-9 items-center justify-center text-foreground"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </Combobox.Trigger>
      </Combobox.InputGroup>

      <Combobox.Portal>
        <Combobox.Positioner className="isolate z-50" sideOffset={8}>
          <Combobox.Popup className="w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
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
            {!loading && !loadError && (
              <Combobox.Empty>
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  {products.length === 0
                    ? "No products available."
                    : "No products match your search."}
                </p>
              </Combobox.Empty>
            )}
            <Combobox.List className="max-h-[min(20rem,var(--available-height))] divide-y divide-border overflow-y-auto overscroll-contain outline-none">
              {(product: Product) => (
                <Combobox.Item
                  key={product.id}
                  value={product}
                  className="block w-full cursor-default px-4 py-2.5 text-left outline-none select-none data-highlighted:bg-background data-selected:bg-background"
                >
                  <span className="block text-sm font-semibold text-foreground">
                    {product.name}
                  </span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {product.genericName}
                  </span>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
