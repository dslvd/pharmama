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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-[#fdf6ec] p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="text-3xl font-bold text-foreground">Items</h2>

          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="rounded-full border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-sm"
              />
            </div>

            <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-slate-200">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-lg border border-slate-300 bg-white">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr>
                <th className="border border-slate-300 px-3 py-2 text-sm font-bold">ID</th>
                <th className="border border-slate-300 px-3 py-2 text-sm font-bold">Product Name</th>
                <th className="border border-slate-300 px-3 py-2 text-sm font-bold">Category</th>
                <th className="border border-slate-300 px-3 py-2 text-sm font-bold">Quantity</th>
                <th className="border border-slate-300 px-3 py-2 text-sm font-bold">Price</th>
                <th className="border border-slate-300 px-3 py-2 text-sm font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-slate-400">
                    No products available.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const sel = selections[product.id]
                  const isAdded = !!sel

                  return (
                    <tr key={product.id} className="odd:bg-white even:bg-violet-50">
                      <td className="border border-slate-300 px-3 py-2 text-center text-sm">{product.id}</td>
                      <td className="border border-slate-300 px-3 py-2 text-sm font-medium">{product.name}</td>
                      <td className="border border-slate-300 px-3 py-2 text-sm text-slate-600">{product.category}</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-sm">
                        {isAdded ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              aria-label="Decrease quantity"
                              className="rounded p-0.5 hover:bg-slate-200"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center font-semibold">{sel.quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              aria-label="Increase quantity"
                              className="rounded p-0.5 hover:bg-slate-200"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-sm">${product.price}</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">
                        <button
                          onClick={() => toggleAdd(product.id, isAdded)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold text-white transition-colors ${
                            isAdded ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {isAdded ? "Added" : "Add"}
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
            className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-900 text-white shadow-lg transition-transform hover:bg-violet-800 active:scale-95 disabled:opacity-50"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}