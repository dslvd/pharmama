"use client";

import { useEffect, useState } from "react";
import { getProductList, searchProduct } from "@/lib/api/product";
import { Product, SortBy, SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import ProductRow from "@/app/products/components/ProductRow";
import AddProductModal from "@/app/products/components/AddProductModal";
import { Funnel, PackageOpen, Search, Plus } from "lucide-react";
import { ErrorStack } from "@/components/ErrorCard";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined,
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  useEffect(() => {
    async function loadProducts() {
      const result = searchTerm.trim()
        ? await searchProduct(searchTerm)
        : await getProductList({ order, sortBy });

      if (result.ok) {
        setProducts(result.value);
      }
    }

    loadProducts();
  }, [order, sortBy, searchTerm, refreshKey]);

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "SORTBY") {
      setSortBy(checked ? (sub as SortBy) : undefined);
    } else if (title === "ORDER") {
      setOrder(checked ? (sub as SortOrder) : undefined);
    }
  };

  const FilterOptions: FilterProps[] = [
    { title: "SORTBY", sub: ["name", "genericName", "category", "price"] },
    { title: "ORDER", sub: ["asc", "desc"] },
  ];

  function openAddModal() {
    setEditingProduct(undefined);
    setShowAddProductModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setShowAddProductModal(true);
  }

  function closeModal() {
    setEditingProduct(undefined);
    setShowAddProductModal(false);
  }

  return (
    <main className="flex min-h-screen flex-col gap-5 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your catalog of items available to sell or dispense.</p>
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
              placeholder="Search products..."
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
              <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-border bg-card p-4 shadow-lg">
                <FilterBar
                  filters={FilterOptions}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}
          </div>
          <button onClick={openAddModal} className="flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-800"><Plus className="h-4 w-4" />Add product</button>
        </div>
      </div>

      <div className="min-h-[32rem] flex-1 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-[#fdfbf7]">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Generic Name
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Category
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Price
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="h-[28rem] px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><PackageOpen className="h-7 w-7" /></span>
                    <p className="text-base font-semibold text-foreground">No products yet</p>
                    <p className="max-w-xs leading-5 text-muted-foreground">Add a product to start building your catalog. You can link stock batches to it right after.</p>
                    <button onClick={openAddModal} className="mt-2 flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-800"><Plus className="h-4 w-4" />Add your first product</button>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <ProductRow
                  key={item.id}
                  product={item}
                  onDeleted={() => setRefreshKey((k) => k + 1)}
                  onEdit={openEditModal}
                  onError={addError}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddProductModal && (
        <AddProductModal
          product={editingProduct}
          onClose={closeModal}
          onSuccess={() => setRefreshKey((k) => k + 1)}
        />
      )}
      <ErrorStack errors={errors} />
    </main>
  );
}
