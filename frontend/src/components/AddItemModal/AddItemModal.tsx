'use client'

import { useState } from "react"
import { X } from "lucide-react"
import { createProduct } from "@/lib/api/product"

interface AddItemModalProps {
  onClose: () => void
  onSaved: () => void
}

interface FormErrors {
  name?: string
  genericName?: string
  price?: string
  category?: string
}

export default function AddItemModal({ onClose, onSaved }: AddItemModalProps) {
  const [name, setName] = useState("")
  const [genericName, setGenericName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function validate(): boolean {
    const next: FormErrors = {}
    if (!name.trim()) next.name = "Required"
    if (!genericName.trim()) next.genericName = "Required"
    if (!price || Number(price) <= 0) next.price = "Must be greater than 0"
    if (!category.trim()) next.category = "Required"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return

    setSaving(true)
    const result = await createProduct({
      name,
      genericName,
      price: Number(price),
      category,
    })

    if (result.ok) {
      onSaved()
      onClose()
    } else {
      setServerError(result.error)
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-[#fdf6ec] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-2xl font-bold text-primary">Add Item</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 hover:bg-slate-200">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm ${errors.name ? "border-red-500" : "border-slate-300"}`}
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </div>

          <div>
            <label className="text-sm font-medium">Generic Name</label>
            <input
              type="text"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm ${errors.genericName ? "border-red-500" : "border-slate-300"}`}
            />
            {errors.genericName && <span className="text-xs text-red-600">{errors.genericName}</span>}
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm ${errors.category ? "border-red-500" : "border-slate-300"}`}
            />
            {errors.category && <span className="text-xs text-red-600">{errors.category}</span>}
          </div>

          <div>
            <label className="text-sm font-medium">Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full rounded border px-3 py-2 text-sm ${errors.price ? "border-red-500" : "border-slate-300"}`}
            />
            {errors.price && <span className="text-xs text-red-600">{errors.price}</span>}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}