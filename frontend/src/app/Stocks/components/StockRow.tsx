import { Trash, PencilLine} from "lucide-react"
import { Stock } from "@/lib/types/stock"

export default function StockRow({ stock }: { stock: Stock }) {
  const createdDate = new Date(stock.createdAt).toLocaleDateString();


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
        {createdDate}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        <button><PencilLine size={14} /></button>
        <button><Trash size={14} /></button>
      </td>
    </tr>
  )
}