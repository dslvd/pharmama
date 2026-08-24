"use client";

import { Filter, Search } from "lucide-react";
import { Transaction } from "@/lib/types/transaction";

interface SalesTableProps {
  transactions: Transaction[];
}

export default function SalesTable({ transactions }: SalesTableProps) {
  return (
    <section>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Transaction ID</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Date</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Time</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Handled by</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground text-right">
                <div className="flex items-center justify-end gap-3 text-muted-foreground">
                  <button aria-label="Filter" className="hover:text-foreground">
                    <Filter className="h-3.5 w-3.5" />
                  </button>
                  <button aria-label="Search" className="hover:text-foreground">
                    <Search className="h-3.5 w-3.5" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border bg-violet-50/60 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{tx.id}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{tx.handledBy || "Admin"}</td>
                <td className="px-4 py-3 text-right">
                  <button aria-label="View transaction detail" className="text-xs font-medium text-violet-700 underline hover:text-violet-900">
                    view
                  </button>
                </td>
              </tr>
            ))}
            {/* Blank row matching wireframe styling */}
            <tr>
              <td className="px-4 py-4" colSpan={5}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}