"use client";

import { useEffect, useState } from "react";
import { Plus, Minus, Search, X, Funnel, Save } from "lucide-react";
import { getProductList, searchProduct } from "@/lib/api/product";
import { Category, Product, SortBy, SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "../../../components/FilterBar";
import { CreateTransactionItemPayload } from "@/lib/types/transaction";
import { getStockList } from "@/lib/api/stocks";
import { Stock } from "@/lib/types/stock";

const inputClasses =
  "rounded-full border border-border bg-white py-1.5 text-sm text-foreground focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";

export interface SubmittedItem {
  trItems: CreateTransactionItemPayload;
  product: Product;
}

export default function AddTransactionModal({
  onSubmit,
  onClose,
}: {
  onSubmit: (items: SubmittedItem[]) => void;
  onClose: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(false);
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [selections, setSelections] = useState<
    Record<number, CreateTransactionItemPayload>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItems() {
      setError("");
      setLoading(true);

      const [stockResult, productResult] = await Promise.all([
        getStockList(),
        searchTerm
          ? searchProduct(searchTerm)
          : getProductList({ category, order, sortBy }),
      ]);

      if (stockResult.ok) {
        setStock(stockResult.value);
      } else {
        setError(stockResult.error);
      }

      if (productResult.ok) {
        setProducts(productResult.value);
      } else {
        setError(productResult.error);
      }

      setLoading(false);
    }

    loadItems();
  }, [category, order, sortBy, searchTerm]);

  const availableProducts = products.filter((product) =>
    stock.some((s) => s.productId === product.id && s.quantity > 0),
  );

  const handleSubmitItems = () => {
    const submitted: SubmittedItem[] = Object.values(selections)
      .filter((item) => item.quantity > 0)
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return { trItems: item, product: product! };
      })
      .filter((entry): entry is SubmittedItem => !!entry.product);

    onSubmit(submitted);
    onClose();
  };

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "CATEGORY") {
      setCategory(checked ? (sub as Category) : undefined);
    } else if (title === "ENTITY") {
      setSortBy(checked ? (sub as SortBy) : undefined);
    } else if (title === "ORDER") {
      setOrder(checked ? (sub as SortOrder) : undefined);
    }
  };

  const FilterOptions: FilterProps[] = [
    {
      title: "CATEGORY",
      sub: [
        "ANALGESICS",
        "ANTIBIOTICS",
        "ANTIHISTAMINES",
        "VITAMINS",
        "SUPPLEMENTS",
        "ANTACIDS",
        "HYGIENE",
        "OTHERS",
      ],
    },
    {
      title: "SORTBY",
      sub: ["name", "genericName", "category", "price"],
    },
    {
      title: "ORDER",
      sub: ["asc", "desc"],
    },
  ];

  function findStockId(stocks: Stock[], productId: number): number | undefined {
    return stocks.find((stock) => stock.productId === productId)?.id;
  }

  const toggleAdd = (id: number, price: number, isAdded: boolean) => {
    setSelections((prev) => {
      const updated = { ...prev };
      if (isAdded) {
        delete updated[id];
      } else {
        updated[id] = {
          quantity: 1,
          productId: id,
          stockId: findStockId(stock, id) ?? 0,
          unitPrice: price,
        };
      }
      return updated;
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setSelections((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      return {
        ...prev,
        [id]: { ...existing, quantity: Math.max(1, existing.quantity + delta) },
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-[#fdf6ec] p-6 shadow-xl">
          <div className="relative z-30 flex items-center justify-between gap-3 pb-4">
          <h2 className="text-2xl font-bold text-foreground">Items</h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setFilter(!filter)}
                aria-label="Toggle filters"
                aria-pressed={filter}
                className={`rounded-lg border p-2.5 transition-colors ${
                  filter
                    ? "border-primary bg-violet-100 text-violet-700"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <Funnel size={18} />
              </button>

              {filter && (
                <div className="absolute right-0 top-full z-50 mt-2 max-h-[calc(85vh-6rem)] w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-lg">
                  <FilterBar
                    filters={FilterOptions}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className={`${inputClasses} pl-9 pr-3`}
              />
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/60">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <ProductRowsSkeleton />
              ) : availableProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No products available.
                  </td>
                </tr>
              ) : (
                availableProducts.map((product) => {
                  const sel = selections[product.id];
                  const isAdded = !!sel;

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-border odd:bg-card even:bg-muted/40 hover:bg-violet-50/60"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{product.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {isAdded ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              aria-label="Decrease quantity"
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center font-semibold text-foreground">
                              {sel.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              aria-label="Increase quantity"
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-foreground">
                        ${product.price}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            toggleAdd(product.id, product.price, isAdded)
                          }
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            isAdded
                              ? "bg-rose-600 text-white hover:bg-rose-700"
                              : "bg-primary text-white hover:bg-primary"
                          }`}
                        >
                          {isAdded ? "Remove" : "Add"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4">
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            onClick={handleSubmitItems}
            disabled={Object.keys(selections).length === 0}
            className="ml-auto flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, row) => (
        <tr key={row} className="border-t border-border">
          {Array.from({ length: 6 }).map((__, column) => (
            <td key={column} className="px-4 py-4">
              <div
                aria-hidden="true"
                className={`skeleton mx-auto h-4 rounded ${
                  column === 5 ? "w-14" : column === 2 ? "w-24" : "w-full"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
