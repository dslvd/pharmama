import { Stock } from "@/lib/types/stock";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function StocksTable({ stocks }: { stocks: Stock[] | null }) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-foreground">Stocks</h3>
        <div className="flex gap-2">
          <button className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <span className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Stock
            </span>
          </button>
          <button className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <span className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              New Product
            </span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                ID
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Product ID
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Batch Number
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Quantity
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Expiry Date
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Added Date
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks ? (
              stocks.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border bg-violet-50/60 last:border-0"
                >
                  <td className="px-4 py-3 text-muted-foreground">{row.id}</td>
                  <td className="px-4 py-3 text-foreground">{row.productId}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.batchNumber}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.quantity}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(row.expiryDate)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <button
                        aria-label={`Edit ${row.batchNumber}`}
                        className="hover:text-violet-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label={`Delete ${row.batchNumber}`}
                        className="hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <div>No stock yet</div>
            )}
            <tr>
              <td className="px-4 py-4" colSpan={8}>
                &nbsp;
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
