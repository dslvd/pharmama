// components/Stock/useAddStock.ts
import { useState } from "react"
import { createStock } from "@/lib/api/stocks"
import { Product } from "@/lib/types/product"

export interface Selection {
  quantity: number
  batchNumber: string
  expiryDate: string
}

export interface FieldErrors {
  batchNumber?: string
  expiryDate?: string
}

export function useAddStock(products: Product[], onSuccess: () => void) {
  // filters
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")

  // selections + errors
  const [selections, setSelections] = useState<Record<number, Selection>>({})
  const [errors, setErrors] = useState<Record<number, FieldErrors>>({})
  const [saving, setSaving] = useState(false)

  const categories = [...new Set(products.map((p) => p.category))]

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = category ? p.category === category : true
    return matchesSearch && matchesCategory
  })

  function updateQuantity(productId: number, delta: number) {
    setSelections((prev) => {
      const current = prev[productId]?.quantity ?? 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const { [productId]: _removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [productId]: {
          quantity: next,
          batchNumber: prev[productId]?.batchNumber ?? "",
          expiryDate: prev[productId]?.expiryDate ?? "",
        },
      }
    })
  }

  function updateField(productId: number, field: "batchNumber" | "expiryDate", value: string) {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }))
    setErrors((prev) => {
      if (!prev[productId]?.[field]) return prev
      return { ...prev, [productId]: { ...prev[productId], [field]: undefined } }
    })
  }

  function toggleAdd(productId: number, isAdded: boolean) {
    if (isAdded) {
      setSelections((prev) => {
        const { [productId]: _removed, ...rest } = prev
        return rest
      })
      setErrors((prev) => {
        const { [productId]: _removed, ...rest } = prev
        return rest
      })
    } else {
      updateQuantity(productId, 1)
    }
  }

  function validate(): boolean {
    const nextErrors: Record<number, FieldErrors> = {}
    let isValid = true

    for (const [id, sel] of Object.entries(selections)) {
      const productId = Number(id)
      const fieldErrs: FieldErrors = {}
      if (!sel.batchNumber.trim()) {
        fieldErrs.batchNumber = "Required"
        isValid = false
      }
      if (!sel.expiryDate) {
        fieldErrs.expiryDate = "Required"
        isValid = false
      }
      if (Object.keys(fieldErrs).length > 0) nextErrors[productId] = fieldErrs
    }

    setErrors(nextErrors)
    return isValid
  }

  async function submit() {
    if (!validate()) return

    setSaving(true)
    for (const [productId, sel] of Object.entries(selections)) {
      const result = await createStock({
        productId: Number(productId),
        batchNumber: sel.batchNumber,
        quantity: sel.quantity,
        expiryDate: new Date(sel.expiryDate),
      })
      if (!result.ok) {
        setErrors((prev) => ({
          ...prev,
          [productId]: { ...prev[Number(productId)], batchNumber: result.error },
        }))
        setSaving(false)
        return
      }
    }
    setSaving(false)
    onSuccess()
  }

  return {
    searchTerm, setSearchTerm,
    category, setCategory, categories,
    filteredProducts,
    selections, errors,
    updateQuantity, updateField, toggleAdd,
    saving, submit,
  }
}