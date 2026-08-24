import { Trash, PencilLine } from "lucide-react";
import { Stock } from "@/lib/types/stock";
import { useState } from "react";
import { deleteStock } from "@/lib/api/stocks";

interface StockRowProps {
  stock: Stock;
  onDeleted?: (id: number) => void;
  onEdit?: (stock: Stock) => void;
}

const LOW_QUANTITY_THRESHOLD = 20;
const EXPIRY_WARNING_DAYS = 30;

export default function StockRow({ stock, onDeleted, onEdit }: StockRowProps) {
  const [deleting, setDeleting] = useState(false);
  const createdDate = new Date(stock.createdAt).toLocaleDateString();
  const expiry = new Date(stock.expiryDate);
  const expiryDate = expiry.toLocaleDateString();

  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  const expiryStyle =
    daysUntilExpiry < 0
      ? "bg-rose-100 text-rose-700" 
      : daysUntilExpiry <= EXPIRY_WARNING_DAYS
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";

  const quantityStyle =
    stock.quantity <= LOW_QUANTITY_THRESHOLD
      ? "bg-amber-100 text-amber-700"
      : "bg-muted text-foreground";

  async function handleDelete(id: number) {
    setDeleting(true);
    const result = await deleteStock(id);
    setDeleting(false);

    if (result.ok) {
      onDeleted?.(id);
    } else {
      console.log(result.error);
    }
  }

  return (
    <tr className="border-t border-border odd:bg-card even:bg-muted/40 hover:bg-violet-50/60">
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        #{stock.id}
      </td>
      <td className="px-4 py-3 text-foreground">{stock.productId}</td>
      <td className="px-4 py-3 text-muted-foreground">{stock.batchNumber}</td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${quantityStyle}`}>
          {stock.quantity}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${expiryStyle}`}>
          {expiryDate}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{createdDate}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 text-muted-foreground">
          <button
            aria-label={`Edit stock ${stock.id}`}
            onClick={() => onEdit?.(stock)}
            className="transition-colors hover:text-violet-700"
          >
            <PencilLine size={15} />
          </button>
          <button
            aria-label={`Delete stock ${stock.id}`}
            onClick={() => handleDelete(stock.id)}
            disabled={deleting}
            className="transition-colors hover:text-rose-600 disabled:opacity-50"
          >
            <Trash size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}