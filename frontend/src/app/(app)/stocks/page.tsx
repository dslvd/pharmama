"use client";

import { useEffect, useMemo, useState } from "react";
import { getStockList } from "@/lib/api/stocks";
import { Stock, SortBy } from "@/lib/types/stock";
import { SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import StockRow from "@/app/(app)/stocks/components/StockRow";
import AddStockModal from "@/app/(app)/stocks/components/AddStockModal";
import Loading from "@/app/(app)/stocks/loading";
import { PackageOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { ErrorStack } from "@/components/ErrorCard";
import { useAuth } from "@/lib/auth";
import { isManager } from "@/lib/roles";
import Dropdown from "@/components/ui/Dropdown";
import { Table, TableEmpty, TableHead, Th } from "@/components/ui/table";

export default function StockPage() {
  const { role } = useAuth();
  const [allStock, setAllStock] = useState<Stock[]>([]);
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
  // fixed at mount, like the dashboard; used for expiry badges
  const [now] = useState(() => Date.now());
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  useEffect(() => {
    async function loadStock() {
      const result = await getStockList();

      if (!result.ok) {
        addError(result.error);
        setLoading(false);
        return;
      }

      setAllStock(result.value);
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
      let aVal: number;
      let bVal: number;

      if (activeSortBy === "quantity") {
        aVal = a.quantity;
        bVal = b.quantity;
      } else if (activeSortBy === "expiryDate") {
        aVal = new Date(a.expiryDate).getTime();
        bVal = new Date(b.expiryDate).getTime();
      } else {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

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
      <main className="flex h-dvh min-h-[36rem] flex-col gap-5 p-6">
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
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <Dropdown
              open={filter}
              onOpenChange={setFilter}
              align="end"
              className="w-80 max-h-none overflow-visible rounded-2xl border-2 border-foreground bg-card p-5 shadow-2xl"
              trigger={
                <button
                  aria-label="Toggle filters"
                  aria-pressed={filter}
                  className={`rounded-lg border p-2.5 transition-colors ${
                    filter
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <SlidersHorizontal size={18} strokeWidth={2.2} />
                </button>
              }
            >
              <FilterBar
                filters={FilterOptions}
                onFilterChange={handleFilterChange}
                onReset={() => {
                  setSortBy([]);
                  setOrder(undefined);
                }}
                selectedValues={{
                  SORTBY: sortBy,
                  ORDER: order,
                }}
              />
            </Dropdown>

            <button
              onClick={() => setShowAddStockModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              Add stock
            </button>
          </div>
        </div>

        <Table className="min-h-0 flex-1">
          <TableHead>
            <Th>Product</Th>
            <Th>Batch</Th>
            <Th align="right">Quantity</Th>
            <Th>Expiry</Th>
            <Th>Status</Th>
            <Th align="right" className="w-24">
              <span className="sr-only">Actions</span>
            </Th>
          </TableHead>
          <tbody>
            {stock.length === 0 ? (
              <TableEmpty
                colSpan={6}
                icon={<PackageOpen className="h-6 w-6" />}
                title={
                  allStock.length === 0
                    ? "No stock recorded yet"
                    : "No matching batches"
                }
              >
                {allStock.length === 0 ? (
                  <>
                    <p>
                      Once you add a batch, it&apos;ll show up here with
                      quantity, expiry, and low-stock status at a glance.
                    </p>
                    <button
                      onClick={() => setShowAddStockModal(true)}
                      className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                    >
                      <Plus className="h-4 w-4" />
                      Add your first stock
                    </button>
                  </>
                ) : (
                  <p>Try a different search.</p>
                )}
              </TableEmpty>
            ) : (
              stock.map((item) => (
                <StockRow
                  key={item.id}
                  stock={item}
                  onDeleted={() => setRefreshKey((k) => k + 1)}
                  onEdit={openEditModal}
                  onError={addError}
                  canDelete={isManager(role)}
                  now={now}
                />
              ))
            )}
          </tbody>
        </Table>

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
