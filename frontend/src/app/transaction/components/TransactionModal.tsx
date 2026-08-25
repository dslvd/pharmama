'use client'

import { useState } from 'react'
import { Plus, Minus, Search, X } from "lucide-react"

export interface ProductItem {
  id: string
  name: string
  category: string
  price: number
}

interface AddTransactionModalProps {
  products?: ProductItem[]
  categories?: string[]
  onClose: () => void
}

const inputClasses =
  "rounded-full border border-border bg-white py-1.5 text-sm text-foreground focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";

export default function AddTransactionModal({
  products = [],
  categories = [],
  onClose,
}: AddTransactionModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [selections, setSelections] = useState<Record<string, { quantity: number }>>({})

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category === "" || product.category === category
    return matchesSearch && matchesCategory
  })

  const toggleAdd = (id: string, isAdded: boolean) => {
    setSelections((prev) => {
      const updated = { ...prev }
      if (isAdded) {
        delete updated[id]
      } else {
        updated[id] = { quantity: 1 }
      }
      return updated
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setSelections((prev) => {
      const currentQty = prev[id]?.quantity ?? 0
      const newQty = Math.max(1, currentQty + delta)
      return {
        ...prev,
        [id]: { quantity: newQty },
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-[#fdf6ec] p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="text-2xl font-bold text-foreground">Items</h2>

          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClasses} px-3`}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product Name</th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quantity</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No products available.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const sel = selections[product.id]
                  const isAdded = !!sel

                  return (
                    <tr key={product.id} className="border-t border-border odd:bg-card even:bg-muted/40 hover:bg-violet-50/60">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{product.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
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
                            <span className="w-4 text-center font-semibold text-foreground">{sel.quantity}</span>
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
                      <td className="px-4 py-3 text-center text-sm text-foreground">${product.price}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleAdd(product.id, isAdded)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                            isAdded
                              ? "bg-rose-600 text-white hover:bg-rose-700"
                              : "bg-violet-700 text-white hover:bg-violet-800"
                          }`}
                        >
                          {isAdded ? "Remove" : "Add"}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            disabled={Object.keys(selections).length === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-950 text-white shadow-md transition-colors hover:bg-violet-900"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}