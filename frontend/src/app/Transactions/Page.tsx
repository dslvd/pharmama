"use client";

import { useState, useEffect } from 'react'
import { getTransactionList } from '@/lib/api/transaction'
import { Transaction } from '@/lib/types/transaction'
import TransactionModal from '@/app/dashboard/components/TransactionModal'

interface TransactionsProps {
  userRole: 'superuser' | 'clinic'
}

export default function Transactions({ userRole }: TransactionsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadTransactions() {
      const result = await getTransactionList()

      if (result.ok) {
        setTransactions(result.value)
      } else {
        console.log(result.error)
      }
    }
    loadTransactions()
  }, [])

  const handleAddItem = (newItem: {
    id: number;
    name: string;
    brand: string;
    quantity: number;
    priceIncluded: boolean;
    noOfItems: number;
  }) => {
    console.log("New Item Added from Modal:", newItem)
  }

  const filteredTransactions = transactions.filter(t =>
    t.handledBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalAmount = transactions.reduce((sum, t) => sum + t.totalAmount, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Transaction</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-primary mt-2">
            {totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm">Filter</p>
          <input
            type="text"
            placeholder="Search by handler or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-2 px-3 py-2 border border-muted rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Add
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          Minus
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Total Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Handled By</th>
                <th className="px-4 py-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border hover:bg-background">
                  <td className="px-4 py-3 text-primary">{tx.id}</td>
                  <td className="px-4 py-3 text-primary">{tx.totalAmount}</td>
                  <td className="px-4 py-3 text-primary">{tx.status}</td>
                  <td className="px-4 py-3 text-primary">{tx.handledBy}</td>
                  <td className="px-4 py-3 text-primary">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
        autoId={transactions.length + 1}
      />
    </div>
  )
}