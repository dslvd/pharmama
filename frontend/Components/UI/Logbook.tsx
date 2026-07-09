'use client'

import { useState } from 'react'

interface LogBookProps {
  userRole: 'superuser' | 'clinic'
}

export default function LogBook({ userRole }: LogBookProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    all: true,
    added: true,
    removed: true,
    updated: true,
    deleted: true,
  })

  const logs = [
    { id: 1, date: '01/15/38', person: 'John Admin', activity: 'Stock Added', details: 'Added 50 units of Paracetamol' },
    { id: 2, date: '01/15/38', person: 'Sarah Manager', activity: 'Transaction Created', details: 'Created purchase order TRX001' },
    { id: 3, date: '01/14/38', person: 'Mike Pharmacist', activity: 'Product Updated', details: 'Updated price' },
    { id: 4, date: '01/14/38', person: 'Emma Clerk', activity: 'Stock Removed', details: 'Removed 30 units' },
    { id: 5, date: '01/13/38', person: 'John Admin', activity: 'Stock Deleted', details: 'Deleted expired batch' },
  ]

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const activityMap: Record<string, keyof typeof filters> = {
      'Stock Added': 'added',
      'Transaction Created': 'added',
      'Product Updated': 'updated',
      'Stock Removed': 'removed',
      'Stock Deleted': 'deleted',
    }
    
    const matchesFilter = filters[activityMap[log.activity] as keyof typeof filters] || filters.all
    
    return matchesSearch && matchesFilter
  })

  return (
    <main className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Log Book</h2>

      {/* Search and Filter Button */}
      <section className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Filter Button</button>
      </section>

      {/* Filter Checkboxes */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-2">
        <p className="font-semibold text-primary mb-3">Activity Type</p>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.all} onChange={() => toggleFilter('all')} className="mr-2" />
          <span className="text-primary">All</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.added} onChange={() => toggleFilter('added')} className="mr-2" />
          <span className="text-primary">Added</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.removed} onChange={() => toggleFilter('removed')} className="mr-2" />
          <span className="text-primary">Removed</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.updated} onChange={() => toggleFilter('updated')} className="mr-2" />
          <span className="text-primary">Updated</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={filters.deleted} onChange={() => toggleFilter('deleted')} className="mr-2" />
          <span className="text-primary">Deleted</span>
        </label>
      </div>

      {/* Log Book Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Person</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index} className="border-b border-border hover:bg-background">
                  <td className="px-4 py-3 text-primary">{log.date}</td>
                  <td className="px-4 py-3 text-primary">{log.person}</td>
                  <td className="px-4 py-3 text-primary">{log.activity}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
