"use client";

import { useState } from "react";
import { X, XCircle } from "lucide-react";
import { createTransaction } from "@/lib/api/transaction";
import { SubmittedItem } from "./ProductPicker";

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
      handledBy: "cashier1",
      transactionItems: items.map((entry) => entry.trItems),
      status: "COMPLETED",
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
    setItems((prev) => prev.filter((item) => item.trItems.productId !== id));
  };

  const grandTotal = items.reduce(
    (acc, curr) => acc + curr.trItems.unitPrice * curr.trItems.quantity,
    0,
  );

  return (
    <div className="flex h-[520px] flex-col rounded-2xl border border-[#e4dccf] bg-white p-4 sm:h-[560px] sm:p-5 lg:h-[620px]">
      <h2 className="mb-4 text-lg font-bold text-[#1e1b3a]">Current sale</h2>

      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-[#9c93b0]">
            No items yet. Add from the left to build a sale.
          </div>
        ) : (
          <ul className="divide-y divide-[#f0ece0]">
            {items.map((item) => (
              <li
                key={item.trItems.productId}
                className="flex items-start justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1e1b3a]">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-[#9c93b0]">
                    {item.trItems.quantity} &times; ₱{" "}
                    {item.trItems.unitPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-semibold text-[#1e1b3a]">
                    ₱{" "}
                    {(
                      item.trItems.unitPrice * item.trItems.quantity
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <button
                    onClick={() => removeItem(item.trItems.productId)}
                    aria-label="Remove item"
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#e4dccf] pt-3">
        <span className="text-sm font-bold text-[#1e1b3a]">Total</span>
        <span className="text-base font-bold text-[#1e1b3a]">
          ₱{" "}
          {grandTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {onCancelTransaction && (
          <button
            onClick={onCancelTransaction}
            disabled={items.length === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-rose-100 py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle size={15} />
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={items.length === 0 || loading}
          className="rounded-full border border-[#d8cfbf] bg-white px-6 py-2.5 text-sm font-semibold text-[#1e1b3a] transition-colors hover:bg-[#f5f1e8] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-shrink-0"
        >
          {loading ? "Submitting..." : "Confirm sale"}
        </button>
      </div>
    </div>
  );
}
