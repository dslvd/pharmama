"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Plus } from "lucide-react";

export interface PendingTransactionItem {
  id: string;
  productName: string;
  brand: string;
  date: string;
  time: string;
  quantity: number;
  price: number;
  status?: "ACTIVE" | "CANCELLED";
}

interface TransactionTableProps {
  initialItems?: PendingTransactionItem[];
  onOpenModal?: () => void;
}

export default function TransactionTable({
  initialItems = [],
  onOpenModal,
}: TransactionTableProps) {
  const [items, setItems] = useState<PendingTransactionItem[]>(initialItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.status !== "CANCELLED") {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const cancelItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, status: "CANCELLED" as const } : item
      );
      return updated.sort((a, b) => (a.status === "CANCELLED" ? 1 : 0) - (b.status === "CANCELLED" ? 1 : 0));
    });
  };

  const activeItems = items.filter((i) => i.status !== "CANCELLED");
  const grandTotal = activeItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-border bg-card">
        <div className="max-h-[350px] overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/60">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product Name</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quantity</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unit Price</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">SubTotal</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <button
                    disabled={activeItems.length === 0}
                    className="rounded-md bg-emerald-800 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                  >
                    Confirm
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No items added yet. Click '+' below to add items.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isCancelled = item.status === "CANCELLED";

                  return (
                    <tr
                      key={item.id}
                      className={`border-t border-border ${
                        isCancelled ? "bg-muted/40 opacity-60" : "odd:bg-card even:bg-muted/40 hover:bg-violet-50/60"
                      }`}
                    >
                      <td className={`px-4 py-3 font-medium ${isCancelled ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {item.productName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="w-4 text-xs font-medium text-foreground">{item.quantity}</span>
                          {!isCancelled && (
                            <div className="flex flex-col text-muted-foreground">
                              <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-foreground">
                                <ChevronUp size={12} />
                              </button>
                              <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-foreground">
                                <ChevronDown size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">${item.price}</td>
                      <td className="px-4 py-3 text-center font-semibold text-foreground">
                        ${item.price * item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isCancelled ? (
                          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
                            CANCELLED
                          </span>
                        ) : (
                          <button
                            onClick={() => cancelItem(item.id)}
                            className="rounded-md border border-border bg-white px-3 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
          <button
            onClick={onOpenModal}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-900 text-white transition-colors hover:bg-violet-950 shadow-sm"
            aria-label="Add More Items"
          >
            <Plus size={16} />
          </button>
          <span className="text-sm font-bold text-foreground">Total: ${grandTotal}</span>
        </div>
      </div>
    </section>
  );
}