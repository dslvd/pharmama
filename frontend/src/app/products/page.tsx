"use client";

import { useEffect, useState } from "react";
import { getProductList, searchProduct } from "@/lib/api/product";
import { Product, SortBy, SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import ProductRow from "@/app/products/components/ProductRow";
import AddProductModal from "@/app/products/components/AddProductModal";
import { Funnel, Search, Plus } from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      const result = searchTerm.trim()
        ? await searchProduct(searchTerm)
        : await getProductList({ order, sortBy });

      if (result.ok) {
        setProducts(result.value);
      } else {
        console.log(result.error);
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
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-4xl font-bold text-foreground">Products</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary"
          >
            <Plus className="h-4 w-4" />
            Add Product
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
                <FilterBar filters={FilterOptions} onFilterChange={handleFilterChange} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Generic Name</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No product records found.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <ProductRow
                  key={item.id}
                  product={item}
                  onDeleted={() => setRefreshKey((k) => k + 1)}
                  onEdit={openEditModal}
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
    </main>
  );
}
