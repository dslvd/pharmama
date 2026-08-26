"use client";

import { useEffect, useMemo, useState } from "react";
import { getStockList } from "@/lib/api/stocks";
import { Stock, SortBy } from "@/lib/types/stock";
import { Product, SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import StockRow from "@/app/stocks/components/StockRow";
import AddStockModal from "@/app/stocks/components/AddStockModal";
import Loading from "@/app/stocks/loading";
import { Funnel, PackageOpen, Plus, Search } from "lucide-react";
import { ErrorStack } from "@/components/ErrorCard";
import { getProduct } from "@/lib/api/product";

// Stock rows enriched with their resolved product info.
export type StockWithProduct = Stock & { product?: Product };

export default function StockPage() {
  const [allStock, setAllStock] = useState<StockWithProduct[]>([]);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [editingStock, setEditingStock] = useState<Stock | undefined>(
    undefined,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  useEffect(() => {
    async function loadStock() {
      setLoading(true);
      const result = await getStockList({});

      if (!result.ok) {
        addError?.(result.error);
        setLoading(false);
        return;
      }

      const stockList = result.value;

      const uniqueProductIds = Array.from(
        new Set(stockList.map((s) => s.productId)),
      );

      const productEntries = await Promise.all(
        uniqueProductIds.map(async (id) => {
          const productResult = await getProduct(id);
          if (!productResult.ok) {
            addError(productResult.error);
            return [id, undefined] as const;
          }
          return [id, productResult.value] as const;
        }),
      );

      const productMap = new Map(productEntries);

      const enriched: StockWithProduct[] = stockList.map((s) => ({
        ...s,
        product: productMap.get(s.productId),
      }));

      setAllStock(enriched);
      setLoading(false);
    }
    loadStock();
  }, [refreshKey]);

  const stock = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let list = allStock.filter(
      (item) =>
        !q ||
        item.batchNumber.toLowerCase().includes(q) ||
        item.product?.name.toLowerCase().includes(q),
    );

    const activeSortBy = sortBy[0] ?? "createdAt";
    const activeOrder = order ?? "desc";

    list = [...list].sort((a, b) => {
      const aVal =
        activeSortBy === "quantity"
          ? a.quantity
          : new Date(a[activeSortBy]).getTime();
      const bVal =
        activeSortBy === "quantity"
          ? b.quantity
          : new Date(b[activeSortBy]).getTime();
      return activeOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [allStock, sortBy, order, searchTerm]);

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "SORTBY") {
      setSortBy((prev) => {
        if (checked)
          return [sub as SortBy, ...prev.filter((item) => item !== sub)];
        return prev.filter((item) => item !== sub);
      });
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
    <>
      <main className="flex min-h-screen flex-col gap-5 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Stocks</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track batches, quantities, and expiry across the branch.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
            <div className="relative min-w-56 flex-1 md:w-56 md:flex-none">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batch or product..."
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>

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
                <div className="absolute right-0 z-10 mt-2 w-80 rounded-2xl border-2 border-foreground bg-card p-5 shadow-2xl">
                  <FilterBar
                    filters={FilterOptions}
                    onFilterChange={handleFilterChange}
                    selectedValues={{
                      SORTBY: sortBy,
                      ORDER: order,
                    }}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAddStockModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-950"
            >
              <Plus className="h-4 w-4" />
              Add stock
            </button>
          </div>
        </div>

        <div className="min-h-128 flex-1 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-[#fdfbf7]">
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Product ID
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Batch No.
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Expiry Date
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="w-24 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground" />
              </tr>
            </thead>
            <tbody>
              {stock.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-112 px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-primary">
                        <PackageOpen className="h-7 w-7" />
                      </span>
                      <p className="text-base font-semibold text-foreground">
                        No stock recorded yet
                      </p>
                      <p className="max-w-xs leading-5 text-muted-foreground">
                        Once you add a batch, it&apos;ll show up here with
                        quantity, expiry, and low-stock status at a glance.
                      </p>
                      <button
                        onClick={() => setShowAddStockModal(true)}
                        className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-950"
                      >
                        <Plus className="h-4 w-4" />
                        Add your first stock
                      </button>
                    </div>
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
        <ErrorStack errors={errors} />
      </main>
      {loading && (
        <div className="pointer-events-auto fixed inset-0 z-40 bg-background">
          <Loading />
        </div>
      )}
    </>
  );
}