// app/stocks/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStockList, searchStock } from '@/lib/api/stocks'
import { getProductList } from '@/lib/api/product'
import { Stock } from '@/lib/types/stock'
import { Product, SortOrder } from '@/lib/types/product'
import FilterBar, { FilterProps } from '@/components/FilterBar'
import StockRow from '@/app/stocks/components/StockRow'
import AddStockButton from '@/app/stocks/components/AddStockBtn'
import AddStockModal from '@/app/stocks/components/AddStockModal'
import AddItemButton from '@/components/AddItemModal/AddButton'
import { Funnel, Search } from 'lucide-react'

export default function StockPage() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadStock() {
      const result = searchTerm.trim()
        ? await searchStock(searchTerm)
        : await getStockList({ order, category });

      if (result.ok) {
        setStock(result.value);
      } else {
        console.log(result.error);
      }
    }
    loadStock();
  }, [order, category, searchTerm, refreshKey]);

  // Keep products loaded in the background so the category filter
  // has real options even before the +Stock modal is opened.
  useEffect(() => {
    async function loadProducts() {
      const result = await getProductList();
      if (result.ok) {
        setProducts(result.value);
      } else {
        console.log(result.error);
      }
    }
    loadProducts();
  }, [refreshKey]);

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "CATEGORY") {
      setCategory(checked ? sub : undefined);
    } else if (title === "ORDER") {
      setOrder(checked ? (sub as SortOrder) : undefined);
    }
  };

  const FilterOptions: FilterProps[] = [
    { title: "CATEGORY", sub: [...new Set(products.map((p) => p.category))] },
    { title: "ORDER", sub: ["asc", "desc"] },
  ];

  const openAddStockModal = useCallback(() => {
    setShowAddStockModal(true);
  }, []);

  return (
    <main className="space-y-6 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-5xl font-bold text-primary">Stocks</h2>

        <div className="flex items-center gap-3">
          <AddItemButton onSaved={() => setRefreshKey((k) => k + 1)} />

          <div className="relative w-64">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <button
            onClick={() => setFilter(!filter)}
            aria-label="Toggle filters"
            className={`rounded-full p-2 transition-colors ${
              filter ? "bg-violet-100 text-primary" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Funnel size={20} />
          </button>
        </div>
      </div>

      {filter && (
        <FilterBar filters={FilterOptions} onFilterChange={handleFilterChange} />
      )}

      <table className="w-full border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">ID</th>
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">Product ID</th>
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">Batch Number</th>
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">Quantity</th>
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">Expiry Date</th>
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">Created At</th>
            <th className="border border-slate-300 px-3 py-2 text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stock.length === 0 ? (
            <tr>
              <td colSpan={7} className="border border-slate-300 px-3 py-6 text-center text-sm text-slate-400">
                No stock records found.
              </td>
            </tr>
          ) : (
            stock.map((item) => (
              <StockRow key={item.id} stock={item} />
            ))
          )}
        </tbody>
      </table>

      <AddStockButton onClick={openAddStockModal} />
      {showAddStockModal && (
        <AddStockModal
          products={products}
          onClose={() => setShowAddStockModal(false)}
          onSaved={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </main>
  )
}