"use client";

import { useMemo, useState } from "react";
import { X, XCircle } from "lucide-react";
import { createTransaction } from "@/lib/api/transaction";
import { SubmittedItem } from "./ProductPicker";
import { peso } from "@/lib/utils/format";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Transaction } from "@/lib/types/transaction";

interface TransactionTableProps {
  items: SubmittedItem[];
  setItems: React.Dispatch<React.SetStateAction<SubmittedItem[]>>;
  onCancelTransaction?: () => void;
  onError?: (message: string) => void;
  // the saved transaction plus the cart that was sold, for the receipt
  onSuccess?: (transaction: Transaction, sold: SubmittedItem[]) => void;
}

export default function TransactionTable({
  items,
  setItems,
  onCancelTransaction,
  onError,
  onSuccess,
}: TransactionTableProps) {
  const [loading, setLoading] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const result = await createTransaction({
      transactionItems: items.map((entry) => entry.trItems),
    });

    if (result.ok) {
      onSuccess?.(result.value, items);
      setItems([]);
    } else {
      onError?.(result.error);
    }
    setLoading(false);
  };

  // one row per product; a big quantity can be split across several stock
  // batches (earliest expiry first), but the cashier only needs the total
  const lines = useMemo(() => {
    const byProduct = new Map<
      number,
      { product: SubmittedItem["product"]; quantity: number; batches: number }
    >();
    for (const item of items) {
      const line = byProduct.get(item.product.id);
      if (line) {
        line.quantity += item.trItems.quantity;
        line.batches += 1;
      } else {
        byProduct.set(item.product.id, {
          product: item.product,
          quantity: item.trItems.quantity,
          batches: 1,
        });
      }
    }
    return [...byProduct.values()];
  }, [items]);

  const removeProduct = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
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
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {line.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {line.quantity} &times; {peso(line.product.price)}
                    {line.batches > 1 && (
                      <> &middot; from {line.batches} batches</>
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {peso(line.product.price * line.quantity)}
                  </span>
                  <button
                    onClick={() => removeProduct(line.product.id)}
                    aria-label={`Remove ${line.product.name}`}
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
            onClick={() => setConfirmClear(true)}
            disabled={items.length === 0}
            className="flex items-center justify-center gap-1.5 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger-soft disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
          >
            <XCircle size={15} />
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={items.length === 0 || loading}
          className="flex flex-1 items-center justify-center rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Confirm sale"}
        </button>
      </div>
      <ConfirmDialog
        open={confirmClear}
        title="Clear current sale?"
        message={`All ${lines.length} item${lines.length === 1 ? "" : "s"} will be removed from the cart.`}
        confirmLabel="Clear sale"
        onConfirm={() => {
          setConfirmClear(false);
          onCancelTransaction?.();
        }}
        onClose={() => setConfirmClear(false)}
      />
    </div>
  );
}
