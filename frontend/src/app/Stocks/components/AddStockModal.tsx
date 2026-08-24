// components/Stock/AddStockModal.tsx
'use client'

import { Plus, Minus, Search, X } from "lucide-react"
import { Product } from "@/lib/types/product"
import { useAddStock } from "./useAddStock"

interface AddStockModalProps {
  products: Product[]
  onClose: () => void
  onSaved: () => void
}

export default function AddStockModal({ products, onClose, onSaved }: AddStockModalProps) {
  const {
    searchTerm, setSearchTerm,
    category, setCategory, categories,
    filteredProducts,
    selections, errors,
    updateQuantity, updateField, toggleAdd,
    saving, submit,
  } = useAddStock(products, () => {
    onSaved()
    onClose()
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-[#fdf6ec] p-6 shadow-xl">
        {/* Header: title + filters + search */}
        <div className="flex items-center justify-between gap-3 pb-4">
          <h2 className="text-3xl font-bold">Items</h2>

          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="rounded-full border border-slate-300 py-1.5 pl-8 pr-3 text-sm"
              />
            </div>

            <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-slate-200">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="flex-1 overflow-y-auto rounded-lg border border-slate-300">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr>
                <th className="border border-slate-300 px-3 py-2 text-sm">ID</th>
                <th className="border border-slate-300 px-3 py-2 text-sm">Product Name</th>
                <th className="border border-slate-300 px-3 py-2 text-sm">Generic Name</th>
                <th className="border border-slate-300 px-3 py-2 text-sm">Quantity</th>
                <th className="border border-slate-300 px-3 py-2 text-sm">Batch Number</th>
                <th className="border border-slate-300 px-3 py-2 text-sm">Expiry Date</th>
                <th className="border border-slate-300 px-3 py-2 text-sm">Price</th>
                <th className="border border-slate-300 px-3 py-2 text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const sel = selections[product.id]
                const fieldErrors = errors[product.id]
                const isAdded = !!sel && sel.quantity > 0

                return (
                  <tr key={product.id} className="odd:bg-white even:bg-violet-50">
                    <td className="border border-slate-300 px-3 py-2 text-center text-sm">{product.id}</td>
                    <td className="border border-slate-300 px-3 py-2 text-sm">{product.name}</td>
                    <td className="border border-slate-300 px-3 py-2 text-sm">{product.genericName}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => updateQuantity(product.id, -1)} aria-label="Decrease quantity">
                          <Minus size={14} />
                        </button>
                        {sel?.quantity ?? 0}
                        <button onClick={() => updateQuantity(product.id, 1)} aria-label="Increase quantity">
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center text-sm">
                      {isAdded ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <input
                            type="text"
                            value={sel.batchNumber}
                            onChange={(e) => updateField(product.id, "batchNumber", e.target.value)}
                            placeholder="Batch #"
                            className={`w-24 rounded border px-1.5 py-1 text-xs ${
                              fieldErrors?.batchNumber ? "border-red-500" : "border-slate-300"
                            }`}
                          />
                          {fieldErrors?.batchNumber && (
                            <span className="text-[10px] text-red-600">{fieldErrors.batchNumber}</span>
                          )}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center text-sm">
                      {isAdded ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <input
                            type="date"
                            value={sel.expiryDate}
                            onChange={(e) => updateField(product.id, "expiryDate", e.target.value)}
                            className={`w-32 rounded border px-1.5 py-1 text-xs ${
                              fieldErrors?.expiryDate ? "border-red-500" : "border-slate-300"
                            }`}
                          />
                          {fieldErrors?.expiryDate && (
                            <span className="text-[10px] text-red-600">{fieldErrors.expiryDate}</span>
                          )}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center text-sm">{product.price}</td>
                    <td className="border border-slate-300 px-3 py-2 text-center">
                      <button
                        onClick={() => toggleAdd(product.id, isAdded)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                          isAdded ? "bg-red-500" : "bg-green-500"
                        }`}
                      >
                        {isAdded ? "Added" : "Add"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            onClick={submit}
            disabled={saving || Object.keys(selections).length === 0}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}