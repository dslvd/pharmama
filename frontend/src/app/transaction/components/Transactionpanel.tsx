'use client'

import { Plus } from "lucide-react"

interface TransactionPanelProps {
  onAddTransaction?: () => void
}

export default function TransactionPanel({ onAddTransaction }: TransactionPanelProps) {
  return (
    <section>
      <h3 className="mb-3 text-xl font-bold text-foreground">Transaction</h3>
      <div className="flex min-h-32.5 items-center justify-center rounded-2xl border border-border bg-card">
        <button
          onClick={onAddTransaction}
          aria-label="Add transaction"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-900 text-white transition-colors hover:bg-violet-800"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}