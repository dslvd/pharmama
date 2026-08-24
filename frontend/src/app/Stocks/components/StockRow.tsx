import { Trash, PencilLine } from "lucide-react";
import { Stock } from "@/lib/types/stock";
import { useState } from "react";
import { deleteStock } from "@/lib/api/stocks";

interface StockRowProps {
  stock: Stock;
  onDeleted?: (id: number) => void;
  onEdit?: (stock: Stock) => void;
}

export default function StockRow({ stock, onDeleted, onEdit }: StockRowProps) {
  const [deleting, setDeleting] = useState(false);
  const createdDate = new Date(stock.createdAt).toLocaleDateString();
  const expiryDate = new Date(stock.expiryDate).toLocaleDateString();

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
    <tr className="odd:bg-white even:bg-violet-50">
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {stock.id}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {stock.productId}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {stock.batchNumber}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {stock.quantity}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {expiryDate}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {createdDate}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        <button onClick={() => onEdit?.(stock)}>
          <PencilLine size={14} />
        </button>
        <button onClick={() => handleDelete(stock.id)} disabled={deleting}>
          <Trash size={14} />
        </button>
      </td>
    </tr>
  );
}
