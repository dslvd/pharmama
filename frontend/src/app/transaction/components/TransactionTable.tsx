"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Transaction } from "@/lib/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <section>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">ID</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Product Name</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Brand</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Date</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Time</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Quantity</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Price</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border bg-violet-50/60 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{tx.id}</td>
                <td className="px-4 py-3 text-foreground">Laxative</td>
                <td className="px-4 py-3 text-muted-foreground">--</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>1</span>
                    <div className="flex flex-col">
                      <button aria-label="Increase quantity" className="hover:text-foreground">
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button aria-label="Decrease quantity" className="hover:text-foreground">
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">${tx.totalAmount}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <button
                      aria-label="Confirm item"
                      className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                    >
                      confirm
                    </button>
                    <button aria-label="Delete item" className="hover:text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Blank row matching wireframe styling */}
            <tr>
              <td className="px-4 py-4" colSpan={8}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}