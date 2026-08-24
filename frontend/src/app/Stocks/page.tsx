// app/stocks/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getStockList, searchStock } from "@/lib/api/stocks";
import { Stock, SortBy } from "@/lib/types/stock";
import { SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import StockRow from "@/app/stocks/components/StockRow";
import AddStockModal from "@/app/stocks/components/AddStockModal";
import { Funnel, Search, Plus } from "lucide-react";

export default function StockPage() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | undefined>(
    undefined,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadStock() {
      const result = searchTerm.trim()
        ? await searchStock(searchTerm)
        : await getStockList({ order, sortBy });

      if (result.ok) {
        setStock(result.value);
      } else {
        console.log(result.error);
      }
    }
    loadStock();
  }, [order, sortBy, searchTerm, refreshKey]);

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "SORTBY") {
      setSortBy(checked ? (sub as SortBy) : undefined);
    } else if (title === "ORDER") {
      setOrder(checked ? (sub as SortOrder) : undefined);
    }
  };

  const FilterOptions: FilterProps[] = [
    { title: "SORTBY", sub: ["quantity", "expiryDate", "createdAt"] },
    { title: "ORDER", sub: ["asc", "desc"] },
  ];

  function openEditModal(stock: Stock) {
    setEditingStock(stock);
    setShowAddStockModal(true);
  }

  function closeModal() {
    setEditingStock(undefined);
    setShowAddStockModal(false);
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-4xl font-bold text-foreground">Stocks</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddStockModal(true)}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary"
          >
            <Plus className="h-4 w-4" />
            Add Stock
          </button>

          <div className="relative w-56">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilter(!filter)}
              aria-label="Toggle filters"
              aria-pressed={filter}
              className={`rounded-full border p-2.5 transition-colors ${
                filter
                  ? "border-primary bg-violet-100 text-violet-700"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Funnel size={18} />
            </button>

            {filter && (
              <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-border bg-card p-4 shadow-lg">
                <FilterBar
                  filters={FilterOptions}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ID
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Product ID
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Batch Number
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quantity
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Expiry Date
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Created At
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stock.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No stock records found.
                </td>
              </tr>
            ) : (
              stock.map((item) => (
                <StockRow
                  key={item.id}
                  stock={item}
                  onDeleted={() => setRefreshKey((k) => k + 1)}
                  onEdit={openEditModal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddStockModal && (
        <AddStockModal
          stock={editingStock}
          onClose={closeModal}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </main>
  );
}