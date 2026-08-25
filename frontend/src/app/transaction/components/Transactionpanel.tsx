'use client'

import { Plus } from "lucide-react"

interface TransactionPanelProps {
  onAddTransaction?: () => void
}

export default function TransactionPanel({ onAddTransaction }: TransactionPanelProps) {
  return (
    <div 
      onClick={onAddTransaction}
      className="flex min-h-32.5 cursor-pointer items-center justify-center rounded-2xl border border-border bg-card transition-colors hover:bg-violet-50/80"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddTransaction?.();
        }}
        aria-label="Add transaction"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-950 text-white transition-colors hover:bg-violet-900 shadow-sm"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}