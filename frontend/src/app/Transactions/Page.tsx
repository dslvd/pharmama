"use client";

import { useState } from "react";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");

  const transactions = [
    {
      id: "TRX001",
      productName: "Paracetamol",
      brand: "Brand A",
      date: "01/10/38",
      time: "10:30",
      quantity: 50,
      price: 2.5,
    },
    {
      id: "TRX002",
      productName: "Ibuprofen",
      brand: "Brand B",
      date: "01/10/38",
      time: "14:15",
      quantity: 30,
      price: 3.0,
    },
    {
      id: "TRX003",
      productName: "Vitamin C",
      brand: "Brand C",
      date: "01/09/38",
      time: "09:45",
      quantity: 100,
      price: 1.5,
    },
    {
      id: "TRX004",
      productName: "Aspirin",
      brand: "Brand D",
      date: "01/09/38",
      time: "16:20",
      quantity: 75,
      price: 2.0,
    },
  ];

  const filteredTransactions = transactions.filter(
    (t) =>
      t.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-primary">Transaction</h2>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-primary mt-2">6.7 M</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground text-sm">Filter</p>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-2 px-3 py-2 border border-muted rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          Add
        </button>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          Minus
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Product Name</th>
                <th className="px-4 py-3 text-left">Brand</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-background"
                >
                  <td className="px-4 py-3 text-primary">{tx.id}</td>
                  <td className="px-4 py-3 text-primary">{tx.productName}</td>
                  <td className="px-4 py-3 text-primary">{tx.brand}</td>
                  <td className="px-4 py-3 text-primary">{tx.date}</td>
                  <td className="px-4 py-3 text-primary">{tx.time}</td>
                  <td className="px-4 py-3 text-primary">{tx.quantity}</td>
                  <td className="px-4 py-3 text-primary">{tx.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-bold text-primary mb-4">Sales</h3>
        <p className="text-muted-foreground text-sm">
          - ID, Product Name, Brand, Date, Time, Quantity, Price
        </p>
      </div>
    </div>
  );
}
