import { Plus, Pencil, Trash2 } from "lucide-react"

interface StockRow {
  id: string
  productName: string
  brand: string
  quantity: number
  dateAdded: string
  price: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

// TODO: replace with real data from the stocks API once it's wired up
const MOCK_ROWS: StockRow[] = [
  {
    id: "23-1076-17",
    productName: "Loratadine",
    brand: "Brandless",
    quantity: 500,
    dateAdded: "21-04-2026",
    price: 100,
    status: "In Stock",
  },
]

const STATUS_STYLES: Record<StockRow["status"], string> = {
  "In Stock": "bg-emerald-100 text-emerald-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out of Stock": "bg-rose-100 text-rose-700",
}

export default function StocksTable() {
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
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">ID</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Product Name</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Brand</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Quantity</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Date Added</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Price</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Status</th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-border bg-violet-50/60 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{row.id}</td>
                <td className="px-4 py-3 text-foreground">{row.productName}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.brand}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.quantity}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.dateAdded}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.price}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <button aria-label={`Edit ${row.productName}`} className="hover:text-violet-700">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button aria-label={`Delete ${row.productName}`} className="hover:text-rose-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* empty row to match the wireframe's blank second row */}
            <tr>
              <td className="px-4 py-4" colSpan={8}>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}