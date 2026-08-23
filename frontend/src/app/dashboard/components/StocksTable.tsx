"use client"

import { Pencil, Trash2, Plus } from "lucide-react"

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock"

interface StockRow {
  id: string
  productName: string
  brand: string
  quantity: number
  dateAdded: string
  price: number
  status: StockStatus
}
const placeholderStocks: StockRow[] = []

const statusStyles: Record<StockStatus, string> = {
  "In Stock": "bg-emerald-100 text-emerald-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out of Stock": "bg-rose-100 text-rose-700",
}

export default function StocksTable() {
  const stocks = placeholderStocks

  return (
    <section className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-semibold text-primary">Stocks</h3>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium border border-border rounded-md px-3 py-1.5 text-foreground hover:bg-muted transition-colors">
            <Plus className="h-4 w-4" />
            Stock
          </button>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md px-3 py-1.5 hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" />
            New Product
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 pr-4 font-medium">ID</th>
              <th className="py-2 pr-4 font-medium">Product Name</th>
              <th className="py-2 pr-4 font-medium">Brand</th>
              <th className="py-2 pr-4 font-medium">Quantity</th>
              <th className="py-2 pr-4 font-medium">Date Added</th>
              <th className="py-2 pr-4 font-medium">Price</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No stock items yet. Add your first product to get started.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr
                  key={stock.id}
                  className="border-b border-border last:border-0 hover:bg-muted/40"
                >
                  <td className="py-3 pr-4 text-muted-foreground">
                    {stock.id}
                  </td>
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {stock.productName}
                  </td>
                  <td className="py-3 pr-4">{stock.brand}</td>
                  <td className="py-3 pr-4">{stock.quantity}</td>
                  <td className="py-3 pr-4">{stock.dateAdded}</td>
                  <td className="py-3 pr-4">
                    ₱{stock.price.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[stock.status]}`}
                    >
                      {stock.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center justify-end gap-2 text-muted-foreground">
                      <button
                        aria-label="Edit stock"
                        className="hover:text-primary transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        aria-label="Delete stock"
                        className="hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}