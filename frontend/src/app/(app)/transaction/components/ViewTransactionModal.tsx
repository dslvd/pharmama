"use client";
import { Transaction, TransactionStatus } from "@/lib/types/transaction";
import Modal from "@/components/ui/Modal";

interface ViewTransactionModalProps {
  transaction?: Transaction;
  onClose: () => void;
}

export default function ViewTransactionModal({
  transaction,
  onClose,
}: ViewTransactionModalProps) {
  const items = transaction?.transactionItems;

  const getStatusColor = (currentStatus: TransactionStatus | undefined) => {
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

  return (
    <Modal
      open
      onClose={onClose}
      title={`Transaction #${transaction?.id || "—"} Details`}
      size="2xl"
      contentClassName="flex flex-col min-h-0"
    >
      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-muted/60">
            <tr>
              <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                ID
              </th>
              <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Product Name
              </th>
              <th className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Generic Name
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Quantity
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {items?.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No items found for this transaction.
                </td>
              </tr>
            ) : (
              items?.map((item) => {
                return (
                  <tr
                    key={item.id}
                    className="border-t border-border odd:bg-card even:bg-muted/30 hover:bg-accent/10"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{item.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {item.product?.name ?? "Unknown product"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {item.product?.genericName ?? "Unknown product"}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-foreground">
                      {item.quantity ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-foreground">
                      ₱{" "}
                      {(
                        (item.product?.price || 0) * (item.quantity || 0)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4 text-sm font-bold text-foreground">
        <div className="flex items-center gap-4">
          <span>Handled By: {transaction?.handledBy || "N/A"}</span>
          <div className="flex items-center gap-1.5">
            <span className="font-normal text-muted-foreground">Status:</span>
            <div
              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(
                transaction?.status,
              )}`}
            >
              {transaction?.status}
            </div>
          </div>
        </div>

        <span className="text-base font-bold text-foreground">
          Total: ₱{" "}
          {(transaction?.totalAmount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </Modal>
  );
}
