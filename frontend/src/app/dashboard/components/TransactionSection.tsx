"use client"

import { Plus } from "lucide-react"

interface TransactionSectionProps {
  onAddTransaction?: () => void
}

export default function TransactionSection({
  onAddTransaction,
}: TransactionSectionProps) {
  return (
    <section className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-primary">Transaction</h3>

      <button
        onClick={onAddTransaction}
        className="mt-4 w-full flex items-center justify-center rounded-lg border-2 border-dashed border-border py-10 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        aria-label="Add transaction"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="h-5 w-5" />
        </span>
      </button>
    </section>
  )
}