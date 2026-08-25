"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Transaction, TransactionStatus } from "@/lib/types/transaction";

interface ViewTransactionModalProps {
  transaction?: Transaction;
  onClose: () => void;
}

export default function ViewTransactionModal({
  transaction,
  onClose,
}: ViewTransactionModalProps) {
  const [status, setStatus] = useState<TransactionStatus>(
    transaction?.status || "COMPLETED",
  );

  const getStatusColor = (currentStatus: TransactionStatus) => {
    switch (currentStatus) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "REFUNDED":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  const items = transaction?.transactionitem || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-[#fdf6ec] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-2xl font-bold text-foreground">
            Transaction #{transaction?.id || "—"} Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/60">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Brand
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quantity
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No items found for this transaction.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border odd:bg-card even:bg-muted/40 hover:bg-violet-50/60"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{item.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {item.product.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {item.product.genericName}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-foreground">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-foreground">
                      ${item.product.price * item.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4 text-sm font-bold text-foreground">
          <div className="flex items-center gap-4">
            <span>Handled By: {transaction?.handledBy || "N/A"}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-normal text-muted-foreground">Status:</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-100 ${getStatusColor(
                  status,
                )}`}
              >
                <option value="COMPLETED">COMPLETED</option>
                <option value="REFUNDED">REFUNDED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
          <span className="text-base font-bold text-foreground">
            Total: ${transaction?.totalAmount || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
