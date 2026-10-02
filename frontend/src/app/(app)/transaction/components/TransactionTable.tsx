"use client";

import { useState } from "react";
import { X, XCircle } from "lucide-react";
import { createTransaction } from "@/lib/api/transaction";
import { SubmittedItem } from "./ProductPicker";
import { peso } from "@/lib/utils/format";

interface TransactionTableProps {
  items: SubmittedItem[];
  setItems: React.Dispatch<React.SetStateAction<SubmittedItem[]>>;
  onCancelTransaction?: () => void;
  onError?: (message: string) => void;
  onSuccess?: () => void;
}

export default function TransactionTable({
  items,
  setItems,
  onCancelTransaction,
  onError,
  onSuccess,
}: TransactionTableProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await createTransaction({
      transactionItems: items.map((entry) => entry.trItems),
    });

    if (result.ok) {
      setItems([]);
      onSuccess?.();
      onCancelTransaction?.();
    } else {
      onError?.(result.error);
    }
    setLoading(false);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.trItems.stockId !== id));
  };

  const grandTotal = items.reduce(
    (acc, curr) => acc + curr.product.price * curr.trItems.quantity,
    0,
  );

  return (
    <div className="flex h-[520px] flex-col rounded-2xl border border-border bg-card p-4 sm:h-[560px] sm:p-5 lg:h-[620px]">
      <h2 className="mb-4 text-lg font-bold text-foreground">Current sale</h2>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            No items yet. Add from the left to build a sale.
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((item) => (
              <li
                key={item.trItems.stockId}
                className="flex items-start justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.trItems.quantity} &times; {peso(item.product.price)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {peso(item.product.price * item.trItems.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.trItems.stockId)}
                    aria-label="Remove item"
                    className="rounded-md p-1 text-danger/80 transition-colors hover:bg-danger-soft hover:text-danger"
                  >
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-bold text-foreground">Total</span>
        <span className="text-base font-bold text-foreground">
          {peso(grandTotal)}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {onCancelTransaction && (
          <button
            onClick={onCancelTransaction}
            disabled={items.length === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-danger-soft py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle size={15} />
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={items.length === 0 || loading}
          className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50 sm:flex-shrink-0"
        >
          {loading ? "Submitting..." : "Confirm sale"}
        </button>
      </div>
    </div>
  );
}
