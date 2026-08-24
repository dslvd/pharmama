// components/Product/AddItemButton.tsx
'use client'

import { useState } from "react"
import AddItemModal from "./AddItemModal"

interface AddItemButtonProps {
  onSaved?: () => void
  label?: string
}

export default function AddItemButton({ onSaved, label = "Add Item" }: AddItemButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
      >
        {label}
      </button>

      {open && (
        <AddItemModal
          onClose={() => setOpen(false)}
          onSaved={() => {
            onSaved?.()
            setOpen(false)
          }}
        />
      )}
    </>
  )
}