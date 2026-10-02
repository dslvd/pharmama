import { Trash, PencilLine } from "lucide-react";
import {
  EXPIRING_SOON_DAYS,
  LOW_STOCK_THRESHOLD,
  Stock,
} from "@/lib/types/stock";
import { useState } from "react";
import { deleteStock } from "@/lib/api/stocks";
import ConfirmDialog from "@/components/ConfirmDialog";
import { formatDate } from "@/lib/utils/format";
import { Badge, Td, Tr } from "@/components/ui/table";

const DAY_MS = 24 * 60 * 60 * 1000;

interface StockRowProps {
  stock: Stock;
  onDeleted?: (id: number) => void;
  onEdit?: (stock: Stock) => void;
  onError?: (message: string) => void;
  // only owners/admins can delete stock
  canDelete?: boolean;
  // current time from the page, for expiry checks
  now: number;
}

export default function StockRow({
  stock,
  onDeleted,
  onEdit,
  onError,
  canDelete = false,
  now,
}: StockRowProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const daysLeft = Math.ceil(
    (new Date(stock.expiryDate).getTime() - now) / DAY_MS,
  );
  const expired = daysLeft <= 0;
  const expiringSoon = !expired && daysLeft <= EXPIRING_SOON_DAYS;
  const low = stock.quantity <= LOW_STOCK_THRESHOLD;

  const [statusLabel, statusStyle] = expired
    ? ["Expired", "bg-danger-soft text-danger"]
    : low
      ? ["Low stock", "bg-warning-soft text-warning"]
      : ["In stock", "bg-success-soft text-success"];

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
      <Tr>
        <Td>
          <p className="font-medium">{stock.product?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {stock.product?.genericName}
          </p>
        </Td>
        <Td className="font-mono text-xs text-muted-foreground">
          {stock.batchNumber}
        </Td>
        <Td numeric>
          <span
            className={low ? "font-semibold text-warning" : "font-medium"}
          >
            {stock.quantity}
          </span>
        </Td>
        <Td>
          <p className={expired ? "font-medium text-danger" : ""}>
            {formatDate(stock.expiryDate)}
          </p>
          {expiringSoon && (
            <p className="text-xs text-warning">
              {daysLeft === 1 ? "Tomorrow" : `In ${daysLeft} days`}
            </p>
          )}
        </Td>
        <Td>
          <Badge className={statusStyle}>{statusLabel}</Badge>
        </Td>
        <Td align="right">
          <div className="flex items-center justify-end gap-1 text-muted-foreground">
            <button
              aria-label={`Edit batch ${stock.batchNumber}`}
              onClick={() => onEdit?.(stock)}
              className="rounded-md p-2 transition-colors hover:bg-primary-soft hover:text-primary"
            >
              <PencilLine size={16} />
            </button>
            {canDelete && (
              <button
                aria-label={`Delete batch ${stock.batchNumber}`}
                onClick={() => setConfirmOpen(true)}
                disabled={deleting}
                className="rounded-md p-2 transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
              >
                <Trash size={16} />
              </button>
            )}
          </div>
        </Td>
      </Tr>
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
