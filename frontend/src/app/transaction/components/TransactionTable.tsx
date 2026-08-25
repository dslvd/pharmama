"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, XCircle } from "lucide-react";
import { createTransaction } from "@/lib/api/transaction";
import { SubmittedItem } from "./TransactionModal";

interface TransactionTableProps {
  items: SubmittedItem[];
  setItems: React.Dispatch<React.SetStateAction<SubmittedItem[]>>;
  onOpenModal?: () => void;
  onCancelTransaction?: () => void;
  onError?: (message: string) => void;
}

export default function TransactionTable({
  items,
  setItems,
  onOpenModal,
  onCancelTransaction,
  onError,
}: TransactionTableProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await createTransaction({
      handledBy: "cashier1",
      transactionItems: items.map((entry) => entry.trItems),
      status: "COMPLETED",
    });

    if (result.ok) {
      setItems([]);
      onCancelTransaction?.();
    } else {
      onError?.(result.error);
    }
    setLoading(false);
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.trItems.productId === id) {
          return {
            ...item,
            trItems: {
              ...item.trItems,
              quantity: Math.max(1, item.trItems.quantity + delta),
            },
          };
        }
        return item;
      }),
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.trItems.productId !== id));
  };

  const grandTotal = items.reduce(
    (acc, curr) => acc + curr.trItems.unitPrice * curr.trItems.quantity,
    0,
  );

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-border bg-card">
        <div className="max-h-88 overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/60">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Unit Price
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  SubTotal
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <div className="flex items-center justify-end gap-2">
                    {onCancelTransaction && (
                      <button
                        onClick={onCancelTransaction}
                        className="flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        <XCircle size={14} />
                        Cancel Transaction
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={items.length === 0 || loading}
                      className="rounded-md bg-emerald-800 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                    >
                      {loading ? "Submitting..." : "Confirm"}
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No items added yet. Click &apos;+&apos; below to add items.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.trItems.productId}
                    className="border-t border-border odd:bg-card even:bg-muted/40 hover:bg-violet-50/60"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="w-4 text-xs font-medium text-foreground">
                          {item.trItems.quantity}
                        </span>
                        <div className="flex flex-col text-muted-foreground">
                          <button
                            onClick={() =>
                              updateQuantity(item.trItems.productId, 1)
                            }
                            className="hover:text-foreground"
                          >
                            <ChevronUp size={12} />
                          </button>
                          <button
                            onClick={() =>
                              updateQuantity(item.trItems.productId, -1)
                            }
                            className="hover:text-foreground"
                          >
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">
                      ${item.trItems.unitPrice}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-foreground">
                      ${item.trItems.unitPrice * item.trItems.quantity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => removeItem(item.trItems.productId)}
                        className="rounded-md border border-border bg-white px-3 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
          <button
            onClick={onOpenModal}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-950 text-white transition-colors hover:bg-violet-900 shadow-sm"
            aria-label="Add More Items"
          >
            <Plus size={16} />
          </button>
          <span className="text-sm font-bold text-foreground">
            Total: ${grandTotal}
          </span>
        </div>
      </div>
    </section>
  );
}
