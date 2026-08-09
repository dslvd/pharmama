'use client'

import { useState } from 'react'

interface StocksProps {
  userRole: 'superuser' | 'clinic'
}

export default function Stocks({ userRole }: StocksProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    inStock: true,
    lowStock: true,
    expiringSoon: true,
    expired: true,
    outOfStock: true,
  })

  const stocks = [
    { id: 'STK001', productName: 'Paracetamol', category: 'Pain Relief', brand: 'Brand A', quantity: 500, status: 'In Stock' },
    { id: 'STK002', productName: 'Ibuprofen', category: 'Pain Relief', brand: 'Brand B', quantity: 50, status: 'Low Stock' },
    { id: 'STK003', productName: 'Vitamin C', category: 'Vitamins', brand: 'Brand C', quantity: 200, status: 'In Stock' },
    { id: 'STK004', productName: 'Aspirin', category: 'Pain Relief', brand: 'Brand D', quantity: 10, status: 'Expiring Soon' },
    { id: 'STK005', productName: 'Cough Syrup', category: 'Cold & Cough', brand: 'Brand E', quantity: 0, status: 'Out of Stock' },
  ]

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.brand.toLowerCase().includes(searchTerm.toLowerCase())
    
    const statusMap: Record<string, keyof typeof filters> = {
      'In Stock': 'inStock',
      'Low Stock': 'lowStock',
      'Expiring Soon': 'expiringSoon',
      'Expired': 'expired',
      'Out of Stock': 'outOfStock',
    }
    
    const matchesFilter = filters[statusMap[s.status] as keyof typeof filters]
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Stocks</h2>

      {/* Search and Filter Button */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Filter Button</button>
      </div>

      {/* Filter Checkboxes */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-2">
        <p className="font-semibold text-primary mb-3">Stock Status</p>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.inStock} onChange={() => toggleFilter('inStock')} className="mr-2" />
          <span className="text-primary">In Stock</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.lowStock} onChange={() => toggleFilter('lowStock')} className="mr-2" />
          <span className="text-primary">Low Stock</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.expiringSoon} onChange={() => toggleFilter('expiringSoon')} className="mr-2" />
          <span className="text-primary">Expiring Soon</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.expired} onChange={() => toggleFilter('expired')} className="mr-2" />
          <span className="text-primary">Expired</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.outOfStock} onChange={() => toggleFilter('outOfStock')} className="mr-2" />
          <span className="text-primary">Out of Stock</span>
        </label>
      </div>

      {/* Stocks Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Product Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock, index) => (
                <tr key={index} className="border-b border-border hover:bg-background">
                  <td className="px-4 py-3 text-primary">{stock.id}</td>
                  <td className="px-4 py-3 text-primary">{stock.productName}</td>
                  <td className="px-4 py-3 text-primary">{stock.category}</td>
                  <td className="px-4 py-3 text-primary">{stock.brand}</td>
                  <td className="px-4 py-3 text-primary">{stock.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      stock.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      stock.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                      stock.status === 'Expiring Soon' ? 'bg-orange-100 text-orange-700' :
                      stock.status === 'Out of Stock' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {stock.status}
                    </span>
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
