'use client'

import { useState, useEffect } from 'react'
import { getStockList } from '@/lib/api/stocks'
import { Stock } from '@/lib/types/stock'

interface StocksProps {
  userRole: 'superuser' | 'clinic'
}

export default function Stocks({ userRole }: StocksProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [stocks, setStocks] = useState<Stock[]>([])

  useEffect(() => {
    async function loadStocks() {
      const result = await getStockList()

      if (result.ok) {
        setStocks(result.value)
      } else {
        console.log(result.error)
      }
    }
    loadStocks()
  }, [])

  const filteredStocks = stocks.filter(s =>
    s.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Stocks</h2>

      {/* Search and Filter Button */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by batch number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Filter Button</button>
      </div>

      {/* Stocks Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Product ID</th>
                <th className="px-4 py-3 text-left">Batch Number</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.id} className="border-b border-border hover:bg-background">
                  <td className="px-4 py-3 text-primary">{stock.id}</td>
                  <td className="px-4 py-3 text-primary">{stock.productId}</td>
                  <td className="px-4 py-3 text-primary">{stock.batchNumber}</td>
                  <td className="px-4 py-3 text-primary">{stock.quantity}</td>
                  <td className="px-4 py-3 text-primary">
                    {new Date(stock.expiryDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-muted-foreground text-center py-4">ADD FUNCTION WHERE WE CAN ADD STOCKS</p>
    </div>
  )
}