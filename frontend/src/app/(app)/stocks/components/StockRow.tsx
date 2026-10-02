import { Trash, PencilLine } from "lucide-react";
import { Stock } from "@/lib/types/stock";
import { useState } from "react";
import { deleteStock } from "@/lib/api/stocks";
import ConfirmDialog from "@/components/ConfirmDialog";

interface StockRowProps {
  stock: Stock;
  onDeleted?: (id: number) => void;
  onEdit?: (stock: Stock) => void;
  onError?: (message: string) => void;
  // only owners/admins can delete stock
  canDelete?: boolean;
}

const LOW_QUANTITY_THRESHOLD = 20;

export default function StockRow({
  stock,
  onDeleted,
  onEdit,
  onError,
  canDelete = false,
}: StockRowProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const expiry = new Date(stock.expiryDate);
  const expiryDate = expiry.toLocaleDateString();

  const quantityStyle =
    stock.quantity <= LOW_QUANTITY_THRESHOLD
      ? "bg-warning-soft text-warning"
      : "bg-muted text-foreground";

  async function handleDelete(id: number) {
    setDeleting(true);
    const result = await deleteStock(id);
    setDeleting(false);
    setConfirmOpen(false);

    if (result.ok) {
      onDeleted?.(id);
    } else {
      onError?.(result.error);
    }
  }

  return (
    <>
      <tr className="border-t border-border odd:bg-card even:bg-primary-soft/30">
        <td className="px-4 py-3 text-foreground">{stock.productId}</td>
        <td className="px-4 py-3 text-foreground">{stock.product?.name}</td>
        <td className="px-4 py-3 text-muted-foreground">{stock.batchNumber}</td>
        <td className="px-4 py-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${quantityStyle}`}
          >
            {stock.quantity}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium`}>
            {expiryDate}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${stock.quantity <= LOW_QUANTITY_THRESHOLD ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}
          >
            {stock.quantity <= LOW_QUANTITY_THRESHOLD
              ? "Low stock"
              : "In stock"}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <button
              aria-label={`Edit stock ${stock.id}`}
              onClick={() => onEdit?.(stock)}
              className="transition-colors hover:text-primary"
            >
              <PencilLine size={15} />
            </button>
            {canDelete && (
              <button
                aria-label={`Delete stock ${stock.id}`}
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                className="transition-colors hover:text-danger disabled:opacity-50"
              >
                <Trash size={15} />
              </button>
            )}
          </div>
        </td>
      </tr>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete stock?"
        message={`Batch ${stock.batchNumber} of ${stock.product?.name ?? "this product"} will be removed. This can't be undone.`}
        busy={deleting}
        onConfirm={() => handleDelete(stock.id)}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
